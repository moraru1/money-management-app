import React, { createElement, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Menu from './Menu';

export default function WeeklyToDo(){

    const [tasks, setTasks] = useState([]);
    var [text, setText] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [ Exit, setExit] = useState(false);

    useEffect(() => {
        const loadTasks = async () => {
            const stored = await AsyncStorage.getItem('@weeklyTasks');
            if (stored) setTasks(JSON.parse(stored));
        };
        loadTasks();
    }, []);
    
    useEffect(() => {
        AsyncStorage.setItem('@weeklyTasks', JSON.stringify(tasks));
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
                weeklyToDoStyle.listItem,
                item.done && weeklyToDoStyle.doneTask
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
        
        <View style = {weeklyToDoStyle.container}>
            <Text style = {weeklyToDoStyle.textFirst}>
            This is your weekly to do list,{'\n'}here you can 
            set your tasks for the week.
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
                <Text style = {weeklyToDoStyle.button}>
                    Add task
                </Text>
            </Pressable>

            {showInput && (
                <View style={{marginTop:20}}>
                    <TextInput
                        style={weeklyToDoStyle.input}
                        placeholder="Enter item" placeholderTextColor="white"
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={addTask}
                    />
                    <Pressable style={weeklyToDoStyle.submitButton} onPress={addTask}>
                        <Text style={weeklyToDoStyle.text}>Submit</Text>
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
            <Pressable style={weeklyToDoStyle.exitButton} onPress={() => {
                setExit(true);
                }}>
                <Text style={weeklyToDoStyle.text}>Exit</Text>
            </Pressable>
        </View>
    );
}
const weeklyToDoStyle = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        flex:1,
        backgroundColor:'black',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
    },
    button: {
        
        backgroundColor: '#87CEEB',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Futura',
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        width: 180
    },
    submitButton:{
        backgroundColor: '#4CD6F9',
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
        backgroundColor:'#87CEEB',
        color:'white',
        borderRadius:10,
        borderColor:'#4CD6F9',
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
        borderColor: '#87CEEB',
        width: 100
    }
});