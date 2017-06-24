/* eslint-disable import/first */
require('source-map-support').install()
import 'babel-polyfill'
import Promise from 'bluebird'
import fetch from 'node-fetch'
import Twit from 'twit'
import config from 'config'
import { argv } from 'yargs'

const getProduct = async (url, productRegex) => {
    const res = await fetch(url)
    const data = await res.json()
    return data.products.find(p => productRegex.test(JSON.stringify(p)))
}

const notify = recipientId => {
    const T = new Twit(config.get('twitterAuth'))

    return T.post('direct_messages/events/new', {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: recipientId,
                },
                message_data: {
                    text: 'Product available!',
                },
            },
        },
    })
}

// IIFE to loop until product is found
;(async function run() {
    const { url, productRegex: productRegexStr, recipientId } = argv
    const productRegex = new RegExp(productRegexStr)

    if (!url || !productRegex || !recipientId) {
        console.log('Missing required launch argument. Example:')
        console.log('node dist/app.js --url=http://... --productRegex=someRegex --recipientId=1234')
        process.exit(1)
    }

    console.log('Checking for matching product...')
    const product = await getProduct(url, productRegex)

    if (product) {
        console.log('Product found! Sending Twitter DM')

        try {
            const twitterResponse = await notify(recipientId)
            console.log(twitterResponse)
        } catch (e) {
            console.error('Error sending Twitter DM')
            console.error(e)
        }

        process.exit(0)
    }

    await Promise.delay(Number(config.get('pollDelay')))
    run()
})()
