```ts

import Telegraf from ""
const token = “”；
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command("test", ctx => {
    ctx.telegram.sendMessage(ctx.chat.id, 'Welcome', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Click me", callback_data: 'one' }
                ], 
            ]
        }
    });
});
bot.command("test", ctx => {
    ctx.telegram.sendMessage(ctx.chat.id, 'Welcome', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Click me", callback_data: 'one' }
                ], 
            ]
        }
    });
});

bot.action('one', ctx => {
    // 透過 answerCbQuery 可以用來回應處理邏輯已經完成
    ctx.answerCbQuery('Job has done!');
    ctx.reply("You clicked the button");
});

```
