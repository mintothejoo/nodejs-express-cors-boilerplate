import SlackBot from 'slackbots';

const bot = new SlackBot({
  token: 'xoxb-7891981700-375378145284-awXeAw3g7dxjDtTO01WmEiTc',
  name: 'find_logger',
});

bot.on('start', () => {
  const params = {
    icon_emoji: ':smiley:',
  };

  bot.postMessageToChannel('merchant-server-logger', 'Get Ready To Laugh With @Jokebot!', params);
});

bot.on('error', err => console.log(err));

export const botLogger = async log => {
  console.log("im log", log)
  return bot.postMessageToChannel('merchant-server-logs', `Merchant: ${log}`);
};


// Message Handler
// bot.on('message', data => {
//   if (data.type !== 'message') {
//     return;
//   }

//   handleMessage(data.text);
// });

// function handleMessage(message) {
//   if (message.includes(' chucknorris')) {
//     chuckJoke();
//   } else if (message.includes(' yomama')) {
//     yoMamaJoke();
//   } else if (message.includes(' random')) {
//     randomJoke();
//   } else if (message.includes(' help')) {
//     runHelp();
//   }
// }

// function chuckJoke() {
//   axios.get('http://api.icndb.com/jokes/random').then(res => {
//     const joke = res.data.value.joke;
//     const params = {
//       icon_emoji: ':laughing:',
//     };

//     bot.postMessageToChannel('merchant-server-logger', `Joker: ${joke}`, params);
//   });
// }

// // Tell a Yo Mama Joke
// function yoMamaJoke() {
//   axios.get('http://api.yomomma.info').then(res => {
//     const joke = res.data.joke;

//     const params = {
//       icon_emoji: ':laughing:',
//     };

//     bot.postMessageToChannel('merchant-server-logger', `Yo Mama: ${joke}`, params);
//   });
// }

// // Tell a Random Joke
// function randomJoke() {
//   const rand = Math.floor(Math.random() * 2) + 1;
//   if (rand === 1) {
//     chuckJoke();
//   } else if (rand === 2) {
//     yoMamaJoke();
//   }
// }

// // Show Help Text
// function runHelp() {
//   const params = {
//     icon_emoji: ':question:',
//   };

//   bot.postMessageToChannel('merchant-server-logger', `Type @jokebot with either 'chucknorris', 'yomama' or 'random' to get a joke`, params);
// }
