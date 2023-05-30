const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

//Expecting database connection as a parameter to mongodb. 
//Export as csv in backup directory.
//using mongoose
function doBackup(db) {
  db.listCollections()
    .toArray()
    .then((collections) => {
      // Iterate through each collection
      const exportPromises = collections.map((collection) => {
        const collectionName = collection.name;

        // Export collection data
        return db
          .collection(collectionName)
          .find()
          .toArray()
          .then((data) => {
//           Specify the directory to save backup.
            const backupDirectory = 'E:\\backup\\';
            const filePath = `${backupDirectory}${collectionName}.json`;

            // Create the backup directory if it doesn't exist
            if (!fs.existsSync(backupDirectory)) {
              fs.mkdirSync(backupDirectory, { recursive: true });
            }

            // Write collection data to a JSON file
            return writeFileAsync(filePath, JSON.stringify(data, null, 2));
          });
      });

      // Wait for all exports to complete
      return Promise.all(exportPromises);
    })
    .then(() => {
      console.log('Export completed successfully');
    })
    .catch((error) => {
      console.error('Export failed', error);
    });
}
