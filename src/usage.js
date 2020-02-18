
// i.append({
//   user: "schettn",
//   authorization: "token 049298e426d045b26872e1d7153bb04ddb35afbf",
//   platform: "github"
// }).then(() => {
//   i.append({
//     user: "schettn",
//     authorization: "token 049298e426d045b26872e1d7153bb04ddb35afbf",
//     platform: "github"
//   }).then(() => {
//     i.testGet();
//   });
// });

i.appendList([
    {
      user: "aichnerc",
      authorization: "token 049298e426d045b26872e1d7153bb04ddb35afbf",
      platform: "github"
    },
    {
      user: "kleberbaum",
      authorization: "token 049298e426d045b26872e1d7153bb04ddb35afbf",
      platform: "github"
    }
  ]).catch(err => {
    console.log(err)
  })
  .then(()=> {
    i.testGet()
  })