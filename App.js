import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";

async function readCacheDirectory(setEntries) {
  const entries = await FileSystem.readDirectoryAsync(
    FileSystem.cacheDirectory
  );
  setEntries(entries);
}

async function isFileAsync(uri) {
  const result = await FileSystem.getInfoAsync(uri);
  return result.exists && !result.isDirectory;
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const uri = FileSystem.cacheDirectory + "sample.zip";

  useEffect(() => {
    const zipUrl =
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip";

    isFileAsync(uri).then((isFile) => {
      if (isFile) {
        console.log("ZIP file already downloaded");
        setDownloaded(true);
      } else {
        FileSystem.downloadAsync(zipUrl, uri)
          .then(({ uri }) => {
            console.log("Finished downloading to", uri);
            setDownloaded(true);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }, []);

  useEffect(() => {
    if (downloaded) {
      readCacheDirectory(setEntries);
    }
  }, [downloaded]);

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(entries, null, 2)}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
