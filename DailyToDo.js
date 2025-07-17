import React, { createElement, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Menu from './Menu';

export default function DailyToDo(){

    const [tasks, setTasks] = useState([]);
    var [text, setText] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [ Exit, setExit] = useState(false);

    useEffect(() => {
        const loadTasks = async () => {
            const stored = await AsyncStorage.getItem('@dailyTasks');
            if (stored) setTasks(JSON.parse(stored));
        };
        loadTasks();
    }, []);
    
    useEffect(() => {
        AsyncStorage.setItem('@dailyTasks', JSON.stringify(tasks));
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
                dailyToDoStyle.listItem,
                item.done && dailyToDoStyle.doneTask
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
        
        <View style = {dailyToDoStyle.container}>
            <Text style = {dailyToDoStyle.textFirst}>
            This is your daily to do list,{'\n'}here you can 
            set your tasks for today.
            </Text>
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
                <Text style = {dailyToDoStyle.button}>
                    Add task
                </Text>
            </Pressable>

            {showInput && (
                <View style={{marginTop:20}}>
                    <TextInput
                        style={dailyToDoStyle.input}
                        placeholder="Enter item" placeholderTextColor="white"
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={addTask}
                    />
                    <Pressable style={dailyToDoStyle.submitButton} onPress={addTask}>
                        <Text style={dailyToDoStyle.text}>Submit</Text>
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
            <Pressable style={dailyToDoStyle.exitButton} onPress={() => {
                setExit(true);
                }}>
                <Text style={dailyToDoStyle.text}>Exit</Text>
            </Pressable>
        </View>
    );
}
const dailyToDoStyle = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        flex:1,
        backgroundColor:'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
    },
    button: {
        
        backgroundColor: '#34C759',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Futura',
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        width: 180
    },
    submitButton:{
        backgroundColor: 'green',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Futura',
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        width: 180
    },
    textFirst: {
        fontSize: 16,
        color:'white',
        textAlign: 'center',
        fontFamily: 'Futura',
    },
    text:{
        color:'white',
        textAlign: 'center',
        fontFamily: 'Futura',
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
        backgroundColor:'#34C759',
        color:'white',
        borderRadius:10,
        borderColor:'green',
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
        borderColor: '#34C759',
        width: 100
    }
});

/*
    const handleAddItem = () => {
        const updatedList = addToList(inputText);
        setCurrentList(updatedList);
        setInputText('');
        setShowInput(false);

        <View style={dailyToDoStyle.list}>
            {currentList.map((item, index) => (
                <Text key={index} style={dailyToDoStyle.listItem}>{item}</Text>
            ))}
        </View>
    };*/
    
    /*function AddingTask(){
    const listOfTasks = [];

    return function addTask(task){
        if(task.trim() === '')return listOfTasks;
        listOfTasks.push(task);
        console.log(listOfTasks);
        return listOfTasks;
    };
}*/

//const addToList = AddingTask();

/*const [showInput, setShowInput] = useState(false);
    const [inputText, setInputText] = useState('');
    const [currentList, setCurrentList] = useState([]);
    */