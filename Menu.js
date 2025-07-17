import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import DailyToDo from './DailyToDo';
import MoneyManagement from './MoneyManagement';
import WeeklyToDo from './WeeklyToDo';
import MonthlyToDo from './MonthlyToDo';
import ShoppingList from './ShoppingList';

export default function Menu(){
  const [ showDailyToDo, setShowDailyToDo] = useState(false);
  const [ showWeeklyToDo, setShowWeeklyToDo] = useState(false);
  const [ showMonthlyToDo, setShowMonthlyToDo] = useState(false);
  const [ showMoneyManagement, setShowMoneyManagement] = useState(false);
  const [ showShoppingList, setShowShoppingList] = useState(false);
  
  if( showDailyToDo == true)
    return <DailyToDo/ >;
  if( showWeeklyToDo == true)
    return <WeeklyToDo/ >;
  if( showMonthlyToDo == true)
    return <MonthlyToDo/ >;
  if( showMoneyManagement == true)
    return <MoneyManagement/ >;
  if( showShoppingList == true)
    return <ShoppingList/ >;

  return (
    <View style ={appsStyle.container}>
      <Pressable onPress={()=> {
      setShowDailyToDo(true);
      }}>
        <Text style={buttonsStyle.container}>
          Daily to do list
        </Text>
      </Pressable>
      <Pressable onPress={()=> {
        setShowWeeklyToDo(true);
      }}>
        <Text style={buttonsStyle.container}>
          Weekly to do list
        </Text>
      </Pressable>
      <Pressable onPress={()=> {
        setShowMonthlyToDo(true);
      }}>
        <Text style={buttonsStyle.container}>
          Monthly to do list
        </Text>
      </Pressable>
      <Pressable onPress={()=> {
        setShowMoneyManagement(true);
      }}>
        <Text style={buttonsStyle.container}>
          Money management
        </Text>
      </Pressable>
      <Pressable onPress={()=> {
        setShowShoppingList(true);
      }}>
        <Text style={buttonsStyle.container}>
          Shopping list
        </Text>
      </Pressable>
    </View>
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
const buttonsStyle = StyleSheet.create({
  container: {
    color:'black',
    backgroundColor:'white',
    fontFamily:'Futura',
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    width: 170,
    textAlign: 'center'
  }
});