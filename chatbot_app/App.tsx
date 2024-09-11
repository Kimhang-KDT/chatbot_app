import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';
import ChatDetailScreen from './ChatDetailScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { AuthProvider, useAuth } from './AuthContext';

// 네비게이션 파라미터 타입 정의
// undefined = 파마리터를 안받는다.
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  // chatdetail은 historyid를 무조건 받는다
  ChatDetail: { historyId: number };
};

// undefined를 사용하는 이유 : 파라미터가 없음을 명시, 네비게이션이 파라미터를 전달하지 못하도록 강제
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type MainTabParamList = {
  // home과 History 화면은 선택적으로 (?:) 각각의 타입의 파라미터를 받는다.
  Home: { startNewChat?: boolean }; // 새채팅
  History: { refresh?: number }; // 새로고침
  Profile: undefined; // 프로필 화면은 파라미터가 없다.
};

// 최상위 스택 네비게이터 생성
const RootStack = createStackNavigator<RootStackParamList>();
// 인증 화면 스택 네비게이터 생성
const AuthStack = createStackNavigator<AuthStackParamList>();
// 메인 화면 탭 네비게이터 생성
const MainTab = createBottomTabNavigator<MainTabParamList>();

function AuthScreens() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerTitle: "Register" }}
      />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle';

          if (route.name === 'Home') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.setParams({ startNewChat: true })}
              style={styles.headerButton}
            >
              <Text style={styles.newChatButtonText}>새 채팅</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen 
        name="History" 
        component={HistoryScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.setParams({ refresh: Date.now() })}
              style={styles.headerButton}
            >
              <Ionicons name="refresh" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

// 앱의 전체 구조를 정의
function AppNavigator() {
  // 인증되지 않은 상태와 인증된 상태 확인하여 섹션 전환 - login 파트 혹은 홈 파트로의 전환
  const { isAuthenticated } = useAuth();

  return (
    <RootStack.Navigator>
      {isAuthenticated ? (
        <>
          <RootStack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <RootStack.Screen 
            name="ChatDetail" 
            component={ChatDetailScreen}
            options={{ headerTitle: "Chat Detail" }}
          />
        </>
      ) : (
        <RootStack.Screen 
          name="Auth" 
          component={AuthScreens}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
}

// 모든 네비게이션 컴포넌트 포함하는 컨테이너 역할
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
  newChatButtonText: {
    color: 'red',
    fontSize: 16,
  },
});