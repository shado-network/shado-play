import { fileURLToPath } from 'url'
import path from 'path'

import dotenv from 'dotenv'
import { Scraper, SearchMode, Tweet } from 'agent-twitter-client'
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages.mjs'

import { context } from '../../context.ts'
import { cookies } from './libs/utils.ts'
import { asyncSleep } from '../../core/libs/utils.ts'
import type { PuppetDefinition } from '../../core/types/puppet.ts'

dotenv.config()

// TODO: Find a better way.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cacheDirectoryPaths = [__dirname, '../../../cache/twitter']

export class TwitterClientPlugin {
  client: Scraper

  constructor() {
    this.client = new Scraper()
  }

  login = async (agentDefinition: PuppetDefinition) => {
    //

    cookies.createDirectory(cacheDirectoryPaths)
    const cookiesFilepath = cookies.getFilepath(
      cacheDirectoryPaths,
      agentDefinition,
    )

    //

    try {
      if (cookies.hasPreviousCookies(cookiesFilepath)) {
        const cookiesArray = cookies.retrieve(cookiesFilepath)
        const cookieStrings = await cookies.toCookieStrings(cookiesArray)
        await this.client.setCookies(cookieStrings)

        context.core.logger.puppet(
          'INFO',
          agentDefinition.id,
          "Found it's previous Twitter cookies",
        )
      }

      let loginAttempts = 0
      const MAX_LOGIN_ATTEMPTS = 3
      const ATTEMPT_INTERVAL_SECONDS = 2

      while (true) {
        context.core.logger.puppet(
          'LOG',
          agentDefinition.id,
          `Twitter login attempt #${loginAttempts + 1}`,
        )

        await this.client.login(
          process.env[`TWITTER_${agentDefinition.id.toUpperCase()}_USERNAME`],
          process.env[`TWITTER_${agentDefinition.id.toUpperCase()}_PASSWORD`],
          process.env[`TWITTER_${agentDefinition.id.toUpperCase()}_EMAIL`],
        )

        if (await this.client.isLoggedIn()) {
          context.core.logger.puppet(
            'SUCCESS',
            agentDefinition.id,
            `Logged into Twitter`,
          )

          try {
            const cookiesArray = await this.client.getCookies()
            cookies.store(cookiesArray, cookiesFilepath)

            context.core.logger.puppet(
              'SUCCESS',
              agentDefinition.id,
              `Stored it's new Twitter cookies`,
            )
          } catch (error) {
            context.core.logger.error(
              'DANGER',
              agentDefinition.id,
              `Could not store it's new Twitter cookies`,
            )
          }

          break
        }

        loginAttempts++

        if (loginAttempts > MAX_LOGIN_ATTEMPTS) {
          context.core.logger.error(
            'DANGER',
            agentDefinition.id,
            `Failed to log in to Twitter after ${loginAttempts} attempts`,
          )
          break
        }

        await asyncSleep(ATTEMPT_INTERVAL_SECONDS * (loginAttempts + 1))
      }
    } catch (error) {
      console.error({ error })
      return null
    }
  }

  readMessage = async (
    agentDefinition: PuppetDefinition,
    messages: MessageParam[],
  ) => {
    if (await !this.client.isLoggedIn()) {
      return
    }
    const userId = 'user'
    const message = `Interesting ${agentDefinition.name}, tell me more?`

    const tweets = []

    try {
      // const rawTweets = this.client.getTweetsAndReplies('Garbage_42069', 120)
      // const rawTweets = await this.client.getTweets('garbage_42069', 10)
      // const rawTweets = this.client.getTweetsAndReplies('garbage_42069')
      // const rawTweets = await this.client.fetchSearchTweets(
      const rawTweets = this.client.searchTweets(
        '@garbage_42069',
        50,
        SearchMode.Latest,
      )

      if (!rawTweets) {
        return
      }

      // for await (const rawTweet of rawTweets.tweets) {
      for await (const rawTweet of rawTweets) {
        const parsedTweet: Partial<Tweet> = {
          id: rawTweet.id,
          conversationId: rawTweet.conversationId,
          thread: rawTweet.thread,
          userId: rawTweet.userId,
          username: rawTweet.username,
          name: rawTweet.name,
          text: rawTweet.text,
          hashtags: rawTweet.hashtags,
          mentions: rawTweet.mentions,
          inReplyToStatus: rawTweet.inReplyToStatus,
          inReplyToStatusId: rawTweet.inReplyToStatusId,
          urls: rawTweet.urls,
          timestamp: rawTweet.timestamp,
          timeParsed: rawTweet.timeParsed,
        }

        tweets.push(parsedTweet)
      }
    } catch (error) {
      context.core.logger.error('DANGER', 'Error', error)
    }

    context.core.logger.puppet('LOG', agentDefinition.id, 'Read some Tweets:', {
      tweets: tweets,
    })

    // const response = await this.client.sendTweet('Hello world!', tweets.at(0).id)
    // const json = await response.json()
    // console.log({ json })

    // messages.push({
    //   role: userId,
    //   content: message,
    // })

    // context.core.logger.user('LOG', userId, 'Wrote a message:', {
    //   message: message,
    // })

    // context.core.logger.puppet('LOG', agentDefinition.id, 'Read a message:', {
    //   message: message,
    // })

    return {
      user: userId,
      message: message,
      shouldReply: true,
    }
  }
}
