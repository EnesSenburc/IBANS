import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsModal = ({ visible, onClose }) => {
    const clearAllData = async () => {
        Alert.alert(
            'Onayla',
            'Tüm veriler silinecek. Emin misiniz?',
            [
                {
                    text: 'Vazgeç',
                    style: 'cancel',
                },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert('Başarılı', 'Tüm veriler başarıyla silindi!');
                        } catch (ex) {
                            console.error('Error deleting data:', ex);
                        }
                    },
                },
            ]
        );
    };

    const openWebsite = () => {
        Linking.openURL('https://www.senburc.com').catch((ex) => console.error('Failed to open URL:', ex));
    };

    return (
        <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.modalHeaderText}>Ayarlar</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="close" style={styles.closeButtonIcon} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.formContainer}>
                    <View style={styles.settingItemContainer}>
                        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
                            <Text style={styles.dangerButtonText}>Tüm Verileri Sil</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.aboutContainer}>
                        <Text style={styles.aboutText1}>IBANS v1.0.0</Text>
                        <TouchableOpacity onPress={openWebsite}>
                            <Text style={styles.aboutText2}>Created by Senburc</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    headerContainer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeaderText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonIcon: {
        fontSize: 28,
        color: '#333333',
    },
    formContainer: {
        padding: 20,
        gap: 20,
    },
    settingItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
    },
    settingItemContainer: {
        paddingBottom: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1,
    },
    settingItemText: {
        fontSize: 16,
        color: '#333333',
    },
    dangerButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#ff3030',
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
    dangerButtonText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#ffffff',
    },
    aboutContainer: {
        gap: 10,
    },
    aboutText1: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666666',
    },
    aboutText2: {
        fontSize: 12,
        textAlign: 'center',
        color: '#999999',
    },
});

export default SettingsModal;
