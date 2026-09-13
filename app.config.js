import 'dotenv/config';

export default {
  expo: {
    name: "Naike",
    slug: "Naike-Mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/naike-icon.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#050061",
        foregroundImage: "./assets/naike-adaptive.png",
        monochromeImage: "./assets/naike-adaptive.png"
      },
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.NaikeMobile"
    },
    web: {
      favicon: "./assets/naike-icon.png"
    },
    plugins: ["expo-secure-store", ["expo-splash-screen", {
      image: "./assets/naike-splash.png",
      imageWidth: 180,
      resizeMode: "contain",
      backgroundColor: "#050061"
    }]],
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiKey: process.env.API_KEY,
      studentRm: process.env.STUDENT_RM,
    }
  }
};
