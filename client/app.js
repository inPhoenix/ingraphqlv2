const GRAPHQL_URL = 'http://localhost:9000'

async function fetchGreeting() {
  const reponse = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: `
         query {
            greeting
           }
      `
    })
  })
  const responseBody = await reponse.json()
  return await responseBody.data
  console.log(responseBody)
}

fetchGreeting().then(({ greeting }) => {
  console.log(greeting)
  const title = document.querySelector('h1')
  title.textContent = greeting
})
