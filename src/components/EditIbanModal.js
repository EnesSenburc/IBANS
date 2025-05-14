import React, { useState, useEffect } from 'react';
import { Platform, Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditIbanModal = ({ visible, onClose, ibanItem }) => {
    const [accountOwnerName, setAccountOwnerName] = useState('');
    const [ibanNumber, setIbanNumber] = useState('');
    const [ibanDescription, setIbanDescription] = useState('');

    useEffect(() => {
        if (ibanItem) {
            setAccountOwnerName(ibanItem.name || '');
            setIbanNumber(ibanItem.iban || '');
            setIbanDescription(ibanItem.desc || '');
        }
    }, [ibanItem]);

    const handleIbanChange = (text) => {
        const formattedText = text.replace(/\s+/g, '').toUpperCase();
        const cleanText = formattedText.replace(/[^A-Z0-9]/g, '');
        const formatted = cleanText.replace(/(.{4})(?=.)/g, '$1 ');
        setIbanNumber(formatted);
    };

    const handleUpdateIban = async () => {
        if (!accountOwnerName) {
            Alert.alert('Hata', 'İsim alanı zorunludur.');
            return;
        }

        if (!ibanNumber) {
            Alert.alert('Hata', 'IBAN alanı zorunludur.');
            return;
        }

        try {
            const existingData = await AsyncStorage.getItem('ibanList');
            const parsedData = existingData ? JSON.parse(existingData) : [];

            const updatedIbanList = parsedData.map(item => {
                if (item.id === ibanItem.id) {
                    return {
                        ...item,
                        name: accountOwnerName,
                        iban: ibanNumber,
                        desc: ibanDescription,
                    };
                }
                return item;
            });

            await AsyncStorage.setItem('ibanList', JSON.stringify(updatedIbanList));
            resetFormFields();
            onClose();
        } catch (ex) {
            console.error('Error updating IBAN:', ex);
        }
    };

    const resetFormFields = () => {
        setAccountOwnerName('');
        setIbanNumber('');
        setIbanDescription('');
    };

    return (
        <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeaderText}>IBAN Düzenle</Text>
                    
                    <View style={styles.formContainer}>
                        <View style={styles.formFieldContainer}>
                            <Text style={styles.formFieldLabel}>Ad Soyad</Text>
                            <TextInput style={styles.formInputField} placeholderTextColor={'#999999'} placeholder='Adını ve soyadını yazın.' value={accountOwnerName} onChangeText={setAccountOwnerName} />
                        </View>
                        
                        <View style={styles.formFieldContainer}>
                            <Text style={styles.formFieldLabel}>IBAN</Text>
                            <TextInput style={styles.formInputField} placeholderTextColor={'#999999'} placeholder='IBAN adresini yazın.' value={ibanNumber} onChangeText={handleIbanChange} autoCapitalize="characters" maxLength={32} />
                        </View>
                        
                        <View style={styles.formFieldContainer}>
                            <Text style={styles.formFieldLabel}>Açıklama</Text>
                            <TextInput style={styles.formInputField} placeholderTextColor={'#999999'} placeholder='Açıklama ekleyin. (isteğe bağlı)' value={ibanDescription} onChangeText={setIbanDescription} />
                        </View>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButtonContainer} onPress={handleUpdateIban}>
                            <Text style={styles.saveButtonText}>Güncelle</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.cancelButtonContainer} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080',
    },
    modalContainer: {
        borderRadius: 8,
        padding: 20,
        gap: 25,
        width: '100%',
        backgroundColor: '#ffffff',
    },
    modalHeaderText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    formContainer: {
        gap: 10,
        backgroundColor: '#ffffff',
    },
    formFieldContainer: {
        gap: 5,
        backgroundColor: '#ffffff',
    },
    formFieldLabel: {
        fontSize: 14,
        marginHorizontal: 10,
        color: '#333333',
    },
    formInputField: {
        paddingHorizontal: 15,
        fontSize: 14,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        color: '#333333',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    buttonContainer: {
        gap: 10,
        backgroundColor: '#ffffff',
    },
    saveButtonContainer: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#43a047',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    saveButtonText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#ffffff',
    },
    cancelButtonContainer: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#5a7ff7',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cancelButtonText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#ffffff',
    },
});

export default EditIbanModal;
