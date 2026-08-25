import 'dotenv/config';

export default {
  expo: {
    name: "Naike-Mobile",
    slug: "Naike-Mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png"
      },
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.NaikeMobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: ["expo-secure-store"],
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiKey: process.env.API_KEY,
      studentRm: process.env.STUDENT_RM,
    }
  }
};