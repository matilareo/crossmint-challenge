# Crossmint challenge

## To run

```
npm i
ts-node ./src/index.ts     
```

## Extra comments
Would be more efficient to have an api that accepts an array off positions 

Tryed using Promise.all and sending all request in parallel but received `'Too Many Requests. Try again later.'`

I have issues using the DELETE API `'Missing parameters. The API accepts parameters as JSON, and remember to specify the proper Content-Type'`. Then i noticed that i was missing my candidate id.