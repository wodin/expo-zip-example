import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { unzip } from "react-native-zip-archive";

async function readCacheDirectory(setEntries) {
  const entries = await FileSystem.readDirectoryAsync(
    FileSystem.cacheDirectory + "sample"
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
  const [contents, setContents] = useState(null);
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
      const targetPath = FileSystem.cacheDirectory + "sample";

      unzip(uri, targetPath, "UTF-8")
        .then((path) => {
          console.log(`unzip completed at ${path}`);
          readCacheDirectory(setEntries);
          FileSystem.readAsStringAsync(targetPath + "/sample.txt")
            .then((data) => {
              setContents(data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [downloaded]);

  return (
    <View style={styles.container}>
      {contents && <Text style={styles.paragraph}>{contents}</Text>}
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
  paragraph: {
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    padding: 10,
    margin: 10,
  },
});
