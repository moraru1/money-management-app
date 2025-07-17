import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Menu from './Menu';

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  
  if(showMenu == true)
  {
    return <Menu/ >;
  }
  return (

    <Pressable 
    style={{flex: 1}}
    onPress={() => {
      setShowMenu(true);
    }}
    >
    <View style={appsStyle.container}>
      <Text style={{color: "white", textAlign: "center",
        fontFamily:"Futura"}}>
      Hello!{'\n'}This is your CheckList app,
      here you can organize {'\n'} your tasks and notes.
      </Text>
      <Text style={{color: "white", fontFamily:"Futura", 
        position:"absolute", bottom:'30', }}>
      Tap anywhere on the screen!
      </Text>
      <StatusBar style="auto"/>
    </View>
    </Pressable>
  );
}
const appsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});