module.exports = function StoreTransaction(collection, Data) {
  return new Promise((resolve, reject) => {
    collection.insertOne(Data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.result.ok && result.insertedCount) {
          resolve({error: 0, message: `Successfully Stored Data in collection`})
        } else {
          reject({error: 1, message: `Document was not inserted`})
        }
      }
    })
  });
}