import { Text, View, Pressable, StyleSheet, Platform, TextInput, ScrollView, Alert } from 'react-native';
import React, { createElement, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from './Menu';


export default function MoneyManagement(){

    const [maindebit, setMaindebit ] = useState(0);
    const [seconddebit, setSeconddebit ] = useState(0);
    const [cash, setCash ] = useState(0);
    const [invested, setInvested ] = useState(0);
    const [savings, setSavings ] = useState(0);
    const [Exit, setExit] = useState(false);

    const [lunarSpendings, setLunarSpendings ] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newSpending, setNewSpending] = useState({
        name: "",
        amount: "",
        dueDay: "",
        linkedAccount: "mainDebit"
    });

    const [everydaySpendings, setEverydaySpendings ] = useState([]);

    const [showAddForm2, setShowAddForm2] = useState(false);
    const [newSpending2, setNewSpending2] = useState({
        name: "",
        amount: "",
        linkedAccount: "mainDebit"
    });

    const currentMonth = new Date().toISOString().slice(0, 7);

    useEffect(() => {
        const loadData = async () => {
            try {
                const keys = ['mainDebit', 'secondDebit', 'cash', 'invested', 'savings'];
                const storedValues = await AsyncStorage.multiGet(keys);
                storedValues.forEach(([key, val]) => {
                    const num = Number(val);
                    switch (key) {
                        case 'mainDebit' : 
                            setMaindebit(isNaN(num) ? 0 : num);
                            saveToStorage("mainDebit", num); 
                            break;
                        case 'secondDebit' : 
                            setSeconddebit(isNaN(num) ? 0 : num);
                            saveToStorage("secondDebit", num);  
                            break;
                        case 'cash' : 
                            setCash(isNaN(num) ? 0 : num);
                            saveToStorage("cash", num);  
                            break;
                        case 'invested' : 
                            setInvested(isNaN(num) ? 0 : num);
                            saveToStorage("invested", num);  
                            break;
                        case 'savings' : 
                            setSavings(isNaN(num) ? 0 : num);
                            saveToStorage("savings", num);  
                            break;
                    }
                });
                const spendingData = await AsyncStorage.getItem("lunarSpendings");
                if(spendingData){
                    setLunarSpendings(JSON.parse(spendingData));
                }
                const spendingData2 = await AsyncStorage.getItem("everydaySpendings");
                if(spendingData2){
                    setEverydaySpendings(JSON.parse(spendingData2));
                }
            } catch(error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

    const saveToStorage = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value.toString());
        }catch (error) {
            console.error(`Failed to save ${key}:`, error);
        }
    };

    const markLunarAsPaid = async (index) => {
        const updated = [...lunarSpendings];
        const spending = updated[index];

        switch(spending.linkedAccount){
            case "mainDebit":
                const newMain = maindebit - spending.amount;
                setMaindebit(newMain);
                saveToStorage("mainDebit", newMain);
                break;
            case "secondDebit":
                const newSecond = seconddebit - spending.amount;
                setSeconddebit(newSecond);
                saveToStorage("secondDebit", newSecond);
                break;
            case "cash":
                const newCash = cash - spending.amount;
                setCash(newCash);
                saveToStorage("cash", newCash);
                break;
        }
        
        spending.lastPaid = currentMonth;
        setLunarSpendings(updated);
        await AsyncStorage.setItem("lunarSpendings", JSON.stringify(updated));
    };

    const addNewLunarSpending = async () => {
        const { name, amount, dueDay, linkedAccount } = newSpending;
        if (!name || isNaN(Number(amount)) || isNaN(Number(dueDay))) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const updatedList = [
        ...lunarSpendings,
        {
        name,
        amount: Number(amount),
        dueDay: Number(dueDay),
        linkedAccount,
        lastPaid: ""
        }
    ];

    setLunarSpendings(updatedList);
    await AsyncStorage.setItem("lunarSpendings", JSON.stringify(updatedList));

    // Reset form
    setNewSpending({ name: "", amount: "", dueDay: "", linkedAccount: "mainDebit" });
    setShowAddForm(false);
    };


    const confirmAndRemove = (index) => {
        Alert.alert(
        "Delete Spending?",
        "Are you sure you want to delete this lunar spending?",
        [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => removeLunarSpending(index)
            }
        ]
    );
};


    const removeLunarSpending = async (index) => {
        const updatedList = lunarSpendings.filter((_, i) => i !== index);
        setLunarSpendings(updatedList);
        await AsyncStorage.setItem("lunarSpendings", JSON.stringify(updatedList));
    };

    const addEverydaySpending = async () => {
        const { name, amount, linkedAccount } = newSpending2;
        if (!name || isNaN(Number(amount))) {
            alert("Please fill in all fields correctly.");
            return;
        }
        
        const updatedList = [
        ...everydaySpendings,
        {
        name,
        amount: Number(amount),
        linkedAccount
        }];

        while(updatedList.length > 5)
            updatedList.shift();

        console.log(`Spent ${amount} LEJ on ${name} from ${linkedAccount}`);

        switch(linkedAccount){
            case "mainDebit":
                const newMain = maindebit - amount;
                setMaindebit(newMain);
                saveToStorage("mainDebit", newMain);
                break;
            case "secondDebit":
                const newSecond = seconddebit - amount;
                setSeconddebit(newSecond);
                saveToStorage("secondDebit", newSecond);
                break;
            case "cash":
                const newCash = cash - amount;
                setCash(newCash);
                saveToStorage("cash", newCash);
                break;
        }

        setEverydaySpendings(updatedList);
        await AsyncStorage.setItem("everydaySpendings", JSON.stringify(updatedList));

        // Reset form
        setNewSpending2({ name: "", amount: "", linkedAccount: "mainDebit" });
        setShowAddForm2(false);
    };


    function EditableMoneyBox({ label, value, onChange, storageKey }) {
        const [isEditing, setIsEditing] = useState(false);
        const [tempValue, setTempValue] = useState(value.toString());

        useEffect(() => {
            setTempValue(value.toString());
        }, [value]);

        const handleSave = () => {
            const num = Number(tempValue);
            const finalValue = isNaN(num) ? 0 : num;
            onChange(finalValue);
            saveToStorage(storageKey, finalValue);
            setIsEditing(false);
        };

        return (
        <Pressable onLongPress={() => setIsEditing(true)}
        disable={isEditing}
        >
            {isEditing ? (
                <View style={{flexDirection:'row'}}>
                <TextInput
                    style={moneyManagmentStyle.textBoxesEdit}
                    value={tempValue}
                    keyboardType="numeric"
                    onChangeText={setTempValue}
                    autoFocus
                />
                <Pressable onPress={handleSave} style={{marginLeft: 10}}>
                    <Text style={moneyManagmentStyle.editButton}>✔️</Text>
                </Pressable>
                </View>
            ) : (
                <Text style={moneyManagmentStyle.textBoxes}>
                    {label}: {value} LEJ
                </Text>
            )}
        </Pressable>
        );
    }

    if(Exit == true)
    {
        return <Menu/ >;
    }

    return(

        <ScrollView style = {moneyManagmentStyle.container}>
            <EditableMoneyBox label="Main debit card" value={maindebit} onChange={setMaindebit} storageKey="mainDebit"/>
            <EditableMoneyBox label="Second debit card" value={seconddebit} onChange={setSeconddebit} storageKey="secondDebit"/>
            <EditableMoneyBox label="Cash" value={cash} onChange={setCash} storageKey="cash"/>
            <EditableMoneyBox label="Invested" value={invested} onChange={setInvested} storageKey="invested"/>
            <EditableMoneyBox label="Savings" value={savings} onChange={setSavings} storageKey="savings"/>
            <Pressable>
                <Text style = {moneyManagmentStyle.sectionTitle}>Lunar Spendings:</Text>
                {lunarSpendings.length === 0 ? (
                    <Text style={moneyManagmentStyle.spendingItem}>No recurring spendings set.</Text>
                ) : (
                    lunarSpendings.map((item, index) => {
                        const isPaid = item.lastPaid === currentMonth;
                        return (
                            <View key={index} style={moneyManagmentStyle.spendingItem}>
                                <Pressable onLongPress={() => confirmAndRemove(index)}>
                                <Text style={moneyManagmentStyle.text}>
                                    {item.name}: {item.amount} LEJ from {item.linkedAccount} - {isPaid ? "Paid" : "Unpaid"}
                                </Text>
                                </Pressable>
                                {!isPaid && (
                                    <Pressable onPress={() => markLunarAsPaid(index)} onLongPress={() => confirmAndRemove(index)}>
                                        <Text style={{ color: "#00FF00", fontSize: 16, marginTop: 5}}>✔ Mark as Paid</Text>
                                    </Pressable>
                                )}
                            </View>
                        );
                    })
                )
                }
            </Pressable>
            <Pressable onPress={() => setShowAddForm(!showAddForm)} style={{ marginHorizontal: 10, marginBottom: 10, marginLeft: 10, padding: 15,}}>
                <Text style={{ color: '#00BFFF', fontSize: 16 }}>{showAddForm ? "Cancel" : "+ Add Lunar Spending"}</Text>
            </Pressable>
            {showAddForm && (
                <View style={moneyManagmentStyle.spendingItem}>
                    <TextInput 
                        placeholder="Name"
                        placeholderTextColor="#aaa"
                        color='white'
                        style={moneyManagmentStyle.input}
                        value={newSpending.name}
                        onChangeText={text => setNewSpending(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        placeholder="Amount"
                        placeholderTextColor="#aaa"
                        color='white'
                        style={moneyManagmentStyle.input}
                        value={newSpending.amount}
                        onChangeText={text => setNewSpending(prev => ({ ...prev, amount: text }))}
                    />
                    <TextInput
                        placeholder="Due Day (1–31)"
                        placeholderTextColor="#aaa"
                        color='white'
                        style={moneyManagmentStyle.input}
                        value={newSpending.dueDay}
                        onChangeText={text => setNewSpending(prev => ({ ...prev, dueDay: text }))}
                    />
                    <Text style={[moneyManagmentStyle.text, { marginTop: 5 }]}>Linked Account:</Text>
                        {["mainDebit", "secondDebit", "cash", "invested", "savings"].map((acc) => (
                            <Pressable key={acc} onPress={() => setNewSpending(prev => ({ ...prev, linkedAccount: acc }))}>
                            <Text style={{
                                color: newSpending.linkedAccount === acc ? "#00FF00" : "white",
                                marginLeft: 10,marginVertical: 2
                                }}>{acc}
                            </Text>
                            </Pressable>
                        ))}
                    <Pressable onPress={addNewLunarSpending} style={{ marginTop: 10 }}>
                        <Text style={{ color: '#00FF00', fontSize: 16 }}>✔ Save Spending</Text>
                    </Pressable>
                </View>
            )}
            <Pressable>
                <Text style = {moneyManagmentStyle.sectionTitle}>Everyday Spendings:</Text>
                {everydaySpendings.length === 0 ? (
                    <Text style={moneyManagmentStyle.spendingItem}>There aren`t spendings yet.</Text>
                ) : (
                    everydaySpendings.map((item, index) => {
                        return (
                            <View key={index} style={moneyManagmentStyle.spendingItem}>
                                <Text style={moneyManagmentStyle.text}>
                                    {item.amount} LEJ from {item.linkedAccount} - {item.name}
                                </Text>
                            </View>
                        );
                    })
                )}
            </Pressable>
            <Pressable onPress={() => setShowAddForm2(!showAddForm2)} style={{ marginHorizontal: 10, marginBottom: 10, marginLeft: 10, padding: 15,}}>
                <Text style={{ color: '#00BFFF', fontSize: 16 }}>{showAddForm2 ? "Cancel" : "+ Add Everyday Spendings"}</Text>
            </Pressable>
            {showAddForm2 && (
                <View style={moneyManagmentStyle.spendingItem}>
                    <TextInput 
                        placeholder="Name"
                        placeholderTextColor="#aaa"
                        color='white'
                        style={moneyManagmentStyle.input}
                        value={newSpending2.name}
                        onChangeText={text => setNewSpending2(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        placeholder="Amount"
                        placeholderTextColor="#aaa"
                        color='white'
                        style={moneyManagmentStyle.input}
                        value={newSpending2.amount}
                        onChangeText={text => setNewSpending2(prev => ({ ...prev, amount: text }))}
                    />
                    <Text style={[moneyManagmentStyle.text, { marginTop: 5 }]}>Linked Account:</Text>
                        {["mainDebit", "secondDebit", "cash", "invested", "savings"].map((acc) => (
                            <Pressable key={acc} onPress={() => setNewSpending2(prev => ({ ...prev, linkedAccount: acc }))}>
                            <Text style={{
                                color: newSpending2.linkedAccount === acc ? "#00FF00" : "white",
                                marginLeft: 10,marginVertical: 2
                                }}>{acc}
                            </Text>
                            </Pressable>
                        ))}
                    <Pressable onPress= {addEverydaySpending} style={{ marginTop: 10 }}>
                        <Text style={{ color: '#00FF00', fontSize: 16 }}>✔ Save Spending</Text>
                    </Pressable>
                </View>
            )}
        <Pressable style={moneyManagmentStyle.exitButton} onPress={() => {
            setExit(true);
        }}>
            <Text style={moneyManagmentStyle.text}>Exit</Text>
        </Pressable>
    </ScrollView>
    );
    }
const moneyManagmentStyle = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Futura',
    },
    textBoxes: {
        color: 'white',
        fontFamily: 'Futura',
        padding: 15,
        borderWidth: 4,
        borderColor: '#0097A7',
        borderRadius: 15,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    textBoxesEdit: {
        color: 'white',
        fontFamily: 'Futura',
        padding: 15,
        borderWidth: 4,
        borderColor: '#0097A7',
        borderRadius: 15,
        marginBottom: 15,
        marginLeft: 10,
        width:300
    },
    editButton:{
        color:'green',
        fontFamily:'Futura',
        fontSize: 25,
        marginTop: 15,
        marginLeft: 15
    },
    sectionTitle: {
        color: 'white',
        fontFamily: 'Futura',
        fontSize: 18,
        padding: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        borderRadius: 15
    },
    spendingItem: {
        color: 'white',
        fontFamily: 'Futura',
        padding: 15,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        borderWidth: 2,
        borderColor:'#0097A7',
        borderRadius: 15
    },
    exitButton:{
        padding: 15,
        borderWidth: 4,
        borderColor: '#0097A7',
        borderRadius: 15,
        width:150,
        alignItems:'center',
        alignSelf:'center',
        marginTop: 80,
        marginBottom: 40
    }

});
/*
<Pressable style ={moneyManagmentStyle.button} onPress ={() => {
            console.log("Modifing money management.");
        }}>
        <Text style ={moneyManagmentStyle.text}>
            Modify
        </Text>
</Pressable>

button: {
        padding: 15,
        borderWidth: 4,
        borderColor: '#0097A7',
        borderRadius: 15,
        width:150,
        alignItems:'center',
        alignSelf:'center',
        marginTop: 30,
    },
*/

/*
return (
        <Pressable onLongPress={() => setIsEditing(true)}
        disable={isEditing}
        >
            {isEditing ? (
                <>
                <TextInput
                    style={moneyManagmentStyle.textBoxesEdit}
                    value={tempValue}
                    keyboardType="numeric"
                    onChangeText={setTempValue}
                    autoFocus
                />
                <Pressable onPress={handleSave} style={{marginLeft: 10}}>
                    <Text style={{color:'#00FF00', fontSize: 18}}>✔</Text>
                </Pressable>
                </>
            ) : (
                <Text style={moneyManagmentStyle.textBoxes}>
                    {label}: {value} LEJ
                </Text>
            )}
        </Pressable>
        );
    }
        */