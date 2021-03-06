import React, { useState } from 'react'
import { View, Text, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import countryList from 'country-list';
import { DataStore, Auth } from 'aws-amplify';
import {Order, OrderProduct, CartProduct} from '../../models';
import styles from './styles';
import Button from '../../components/Button';

const countries = countryList.getData();

const AddressScreen = () => {

    const [country, setCountry] = useState(countries[0].code);
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('Invalid Address');
    const [city, setCity] = useState('');

    const navigation = useNavigation();


    const saveOrder = async () => {
        // get User Details
        const userData = await Auth.currentAuthenticatedUser();
        // Create a new Order
        const newOrder = await DataStore.save(
            new Order({
                userSub: userData.attributes.sub,

                fullName: fullname,
                phoneNumber: phone,
                country,
                city,
                address,
            }),
        );

        // fetch all cart items
        const cartItems = await DataStore.query(CartProduct, cp => 
            cp.userSub('eq', userData.attributes.sub),
        );

        // Attach all cart items to the order
        await Promise.all(
            cartItems.map(cartItem => DataStore.save(new OrderProduct({
                quantity: cartItem.quantity,
                option: cartItem.option,
                productID: cartItem.productID,
                orderID: newOrder.id,
            }),
            ),
            ),
        );

        // delete all cart items
        await Promise.all(
            cartItems.map(cartItem => DataStore.delete(cartItem)));

        // redirect home
            navigation.navigate('Home');
    }


    const onCheckout = () => {
        if(!!addressError) {
            Alert.alert('Fix all field errors before submitting');
            return;
        }
        if(!fullname){
            Alert.alert('Please Enter Name');
            return;
        }

        if(!phone){
            Alert.alert('Please Enter Phone number');
            return;
        }

        saveOrder();
    }

    const validateAddress = () => {
        if (address.length < 3 ) {
            setAddressError('Address is too short')
        }
    }
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
        <ScrollView style={styles.root}>
            <View style={styles.row}>
                <Picker
                selectedValue={country} onValueChange={setCountry}>
                    {countries.map(country => <Picker.Item value={country.code} label={country.name}/>)}
                    
                </Picker>
            </View>
           {/* Full name */}
            <View style={styles.row}>
            <Text style={styles.label}>Full name (First and Last name)</Text>
            <TextInput
                style={styles.input}
                placeholder="Full name"
                value={fullname}
                onChangeText={setFullname}
            />
            </View>

            {/* Phone number */}
            <View style={styles.row}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType={'phone-pad'}
            />
            </View>

            {/* Address */}
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onEndEditing={validateAddress}
            onChangeText={text => {
              setAddress(text);
              setAddressError('');
            }}
          />
          {!!addressError && (
            <Text style={styles.errorLabel}>{addressError}</Text>
          )}
        </View>

             {/* City */}
            <View style={styles.row}>
            <Text style={styles.label}>City</Text>
            <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
            />
            </View>

            <Button text='Checkout' onPress={onCheckout}/>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddressScreen;
