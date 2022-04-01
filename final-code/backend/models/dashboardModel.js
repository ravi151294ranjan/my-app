
module.exports = {
    /**
     * * getcountOfuser method to get user count.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data 
     * @return {Object} Its return the count
     */
    getcount: (collectionName) => {
        return new Promise((resolve, reject) => {

            let result = {
                success: true,
                status: 200,
                groupCount: 1,
                scenarioCount: 1,
                message: "success."
            }
            resolve(result)
            
        })
    },
}