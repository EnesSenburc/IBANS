import { useState, useEffect } from 'react';
import { Platform, Text, View, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';

import SettingsScreen from '../components/SettingsModal';
import AddIbanModal from '../components/AddIbanModal';
import EditIbanModal from '../components/EditIbanModal';

const HomeScreen = () => {
    const [ibanList, setIbanList] = useState([]);

    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedIbanForEdit, setSelectedIbanForEdit] = useState(null);

    const [contextMenu, setContextMenu] = useState({
        isVisible: false,
        positionX: 0,
        positionY: 0,
        selectedItem: null
    });

    const fetchIbanList = async () => {
        try {
            const storedData = await AsyncStorage.getItem('ibanList');
            const parsedData = storedData ? JSON.parse(storedData) : [];
            setIbanList(parsedData);
        } catch (error) {
            console.error('Error loading IBAN list:', error);
        }
    };

    useEffect(() => {
        fetchIbanList();
    }, [isAddModalVisible, isEditModalVisible, isSettingsVisible]);

    const handleContextMenuOpen = (item, event) => {
        const { pageX, pageY } = event.nativeEvent;
        
        setContextMenu({
            isVisible: true,
            positionX: pageX,
            positionY: pageY,
            selectedItem: item,
        });
    };

    const handleEditIban = () => {
        setSelectedIbanForEdit(contextMenu.selectedItem);
        setIsEditModalVisible(true);
        closeContextMenu();
    };

    const handleDeleteIban = async () => {
        Alert.alert(
            'Onayla',
            'Silmek istediğinizden Emin misiniz?',
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
                            const updatedIbanList = ibanList.filter(
                                (ibanItem) => ibanItem.id !== contextMenu.selectedItem.id
                            );
                            await AsyncStorage.setItem('ibanList', JSON.stringify(updatedIbanList));
                            setIbanList(updatedIbanList);
                            closeContextMenu();
                        } catch (ex) {
                            console.error('Error deleting IBAN:', ex);
                        }
                    },
                },
            ]
        )
    };

    const closeContextMenu = () => {
        setContextMenu({
            ...contextMenu, 
            isVisible: false,
        });
    };

    const copyToClipboard = async (text, type) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Bilgi', `${type} kopyalandı!`);
    };

    const renderIbanItem = ({ item }) => (
        <View style={styles.ibanItemContainer}>
            <TouchableOpacity onPress={() => copyToClipboard(item.name, 'İsim')}>
                <Text style={styles.ibanNameText}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(item.iban, 'IBAN')}>
                <Text style={styles.ibanNumberText}>{item.iban}</Text>
            </TouchableOpacity>
            {item.desc ? <Text style={styles.ibanDescriptionText}>{item.desc}</Text> : null}
            <TouchableOpacity style={styles.ibanOptionsButton} onPress={(event) => handleContextMenuOpen(item, event)}>
                <Icon name="ellipsis-vertical" style={styles.ibanOptionsButtonIcon} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.screenContainer}>
            <StatusBar backgroundColor={'#f0f0f0'}/>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitleText}>IBANS</Text>
                <TouchableOpacity style={styles.settingsButton}  onPress={() => setIsSettingsVisible(true)}>
                    <Icon name="settings" style={styles.settingsButtonIcon} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addIbanButton} onPress={() => setIsAddModalVisible(true)}>
                <Icon name="add" style={styles.addIbanButtonIcon} />
            </TouchableOpacity>
            
            <FlatList data={ibanList} keyExtractor={(item) => item.id.toString()} renderItem={renderIbanItem} contentContainerStyle={styles.ibanListContainer} />
            
            <SettingsScreen visible={isSettingsVisible} onClose={() => {setIsSettingsVisible(false); fetchIbanList();}} />

            <AddIbanModal visible={isAddModalVisible} onClose={() => {setIsAddModalVisible(false); fetchIbanList();}} />
            
            <EditIbanModal visible={isEditModalVisible} onClose={() => {setIsEditModalVisible(false); setSelectedIbanForEdit(null); fetchIbanList();}} ibanItem={selectedIbanForEdit} />
            
            {contextMenu.isVisible && (
                <Modal transparent={true} visible={contextMenu.isVisible} animationType="fade" onRequestClose={closeContextMenu}>
                    <TouchableOpacity style={styles.contextMenuOverlay} activeOpacity={1} onPress={closeContextMenu}>
                        <View style={[styles.contextMenuContainer, {left: contextMenu.positionX - 80, top: contextMenu.positionY + 10}]}>
                            <TouchableOpacity style={styles.contextMenuItem} onPress={handleEditIban}>
                                <Text style={styles.contextMenuItemText}>Düzenle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contextMenuItem} onPress={handleDeleteIban}>
                                <Text style={styles.contextMenuItemText}>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    headerTitleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
    },
    settingsButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsButtonIcon: {
        fontSize: 28,
        color: '#333333',
    },
    addIbanButton: {
        zIndex: 1,
        width: 50,
        height: 50,
        bottom: 50,
        right: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
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
    addIbanButtonIcon: {
        fontSize: 34,
        color: '#ffffff',
    },
    ibanListContainer: {
        gap: 10,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    ibanItemContainer: {
        gap: 5,
        padding: 15,
        borderRadius: 8,
        alignItems: 'flex-start',
        backgroundColor: '#f0f0f0',
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
    ibanNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    ibanNumberText: {
        fontSize: 16,
        color: '#444444',
    },
    ibanDescriptionText: {
        fontSize: 14,
        color: '#666666',
    },
    ibanOptionsButton: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        top: 0,
        right: 0,
        position: 'absolute',
    },
    ibanOptionsButtonIcon: {
        fontSize: 22,
        color: '#333333',
    },
    contextMenuOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contextMenuContainer: {
        width: 100,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'absolute',
        backgroundColor: '#ffffff',
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
    contextMenuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contextMenuItemText: {
        fontSize: 14,
        color: '#333333',
    },
});

export default HomeScreen;
