import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import logo from './assets/oldM.jpg';
import * as ImagePicker from 'expo-image-picker';
import { block } from 'react-native-reanimated';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {

  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePicker = async () => {  
    let permissionResult= await ImagePicker.requestMediaLibraryPermissionsAsync();

    //Recordar eliminar estas lineas despues de probar el SplashScreen
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync,5000);
    //

    if (permissionResult.granted === false){
      alert('Permition to access to libery')
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    //si cancela la seleccion no retorna nada..
    if(pickerResult.cancelled == true){
      return;
    }

    if(Platform.OS === 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri});
    } else{
      setSelectedImage({localUri: pickerResult.uri, remoteUri: null});
    }

    setSelectedImage({localUri: pickerResult.uri});

  };// end openImagePicker

  let openShareDialogAsync = async () => {
    if(!( await Sharing.isAvailableAsync() ) ){
      alert (`The image is available for sharing at: ${selectedImage.remoteUri} `);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }

  if (selectedImage !== null){
    return(
      <View style={styles.container}>
        <Image source={{ uri:selectedImage.localUri }} style={styles.thumbnail}/>
        <TouchableOpacity onPress={openShareDialogAsync}style={styles.button}>
          <Text style={styles.buttonText}>
            Share this photo
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo}/>

      <Text style={styles.instrutionsFooter}>
        Illustration by Eduardo Calderon
      </Text>
      <Text style={styles.instrutions}>
        To share a photo from your phone with a frind, just press the button below!
      </Text>

      <TouchableOpacity onPress={ openImagePicker } style={styles.button}>
        <Text style={styles.buttonText}>
          Pick a photo
        </Text>
      </TouchableOpacity>

    </View>
  );
}// end function app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeff22',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo:{
    width: 256,
    height: 256,
  },
  instrutions:{
    color:'#888',
    padding: 20,
    alignContent: 'center'
  },
  instrutionsFooter:{
    color: '#000',
    fontSize: 8,
  },
  button:{
    padding:20,
    borderRadius: 5,
    backgroundColor:'#B243E3',
    shadowColor:'#B243E3',
    shadowOpacity:0.5,
    shadowOffset:{width: 5, height: 5},
  },
  buttonText:{
    fontSize: 20,
    color:'#fff'
  },
  thumbnail:{
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
});
