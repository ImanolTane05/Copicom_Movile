import AsyncStorage from "@react-native-async-storage/async-storage";

const INSTALL_KEY = "install_time";

export const getInstallTime = async () => {
    let time = await AsyncStorage.getItem(INSTALL_KEY);

    if (!time) {
        const now = new Date().toISOString();
        await AsyncStorage.setItem(INSTALL_KEY, now);
        time = now;
    }

    return new Date(time);
};
