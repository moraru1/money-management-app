import { View, Pressable, Text, StyleSheet, Platform, FlatList, TextInput } from 'react-native';
import React, { createElement, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from './Menu';

export default function ShoppingList(){

    const [Exit, setExit] = useState(false);
    const [tasks, setTasks] = useState([]);
    var [text, setText] = useState('');
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        const loadTasks = async () => {
            const stored = await AsyncStorage.getItem('@shoppingItems');
            if (stored) setTasks(JSON.parse(stored));
        };
        loadTasks();
    }, []);
    
    useEffect(() => {
        AsyncStorage.setItem('@shoppingItems', JSON.stringify(tasks));
    }, [tasks]);

    
    const addTask = () => {
        if(text.trim() === '') return;
        text = text.trim();
        setTasks(prev => [...prev, {id:Date.now().toString(), text, done:false}]);
        setText('');
    };

    const renderItem = ({item}) => (
        <Pressable
        onLongPress={() =>  deleteTask(item.id)} 
        onPress={() => toggleTask(item.id)}>
            <Text style ={[
                ShoppingListStyle.listItem,
                item.done && ShoppingListStyle.doneTask
            ]}>
                {item.text}
            </Text>
        </Pressable>
    );

    const toggleTask = (id) => {
        setTasks( prev =>
            prev.map(task =>
                task.id === id ? { ...task, done: !task.done } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks( prev =>
            prev.filter(task =>
                task.id !== id
            )
        );
    };

    if(Exit == true)
    {
        return <Menu/ >;
    }

    return(
        <View style ={ShoppingListStyle.container}>
            <Text style = {ShoppingListStyle.text}> This is your shopping list.</Text>
            <Pressable style = {{marginTop: 150}} onPress={() => {
                if(showInput === false)
                {
                    setShowInput(true);
                }
                else
                {
                    setShowInput(false);
                }
            }}>
            <Text style = {ShoppingListStyle.button}>
                Add items
            </Text>
            </Pressable>
            {showInput && (
                <View style={{marginTop:20}}>
                    <TextInput
                        style={ShoppingListStyle.input}
                        value={text}
                        placeholder="Enter item" placeholderTextColor="white"
                        onSubmitEditing={addTask}
                        onChangeText={setText}
                    />
                    <Pressable style={ShoppingListStyle.submitButton} onPress={addTask}>
                        <Text style={ShoppingListStyle.text}>Submit</Text>
                    </Pressable>
                </View>
            )}
            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={renderItem} 
                style = {{ width:'50%', marginTop:50, marginBottom: 50}}
                contentContainerStyle = {{
                                        alignItems:'center',
                                        justifyContent:'flex-start',
                                        }}
            />
            <Pressable style = {ShoppingListStyle.exitButton} onPress = {() => {
                setExit(true);
            }}>
                <Text style={ShoppingListStyle.text}>Exit</Text>
            </Pressable>
        </View>
    );
}
const ShoppingListStyle = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
        alignItems: 'center',
        padding:20
    },
    text:{
        color:'white',
        fontFamily:'Futura',
        fontSize: 15,
        alignSelf:'center',
    },
    button:{
        backgroundColor: '#B99470',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Futura',
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        width: 185
    },
    input:{
        borderColor: 'white',
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'Futura',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    submitButton:{
        backgroundColor: '#A3774D',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Futura',
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        width: 180
    },
    list:{
        fontFamily:'Futura',
        width: 180,
        marginTop: 10,
    },
    listItem:{
        width:175,
        fontSize: 15,
        fontFamily:'Futura',
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign:'center',
        backgroundColor:'#B99470',
        color:'white',
        borderRadius:10,
        borderColor:'#A3774D',
        borderWidth:2,
        marginBottom:10,
    },
    doneTask:{
        textDecorationLine:'line-through',
        color:'green',
        borderColor:'green',
        backgroundColor:'black'
    },
    exitButton:{
        backgroundColor: 'black',
        textAlign: 'center',
        fontFamily: 'Futura',
        padding: 15,
        paddingHorizontal: 10,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#B99470',
        width: 100
    }
})