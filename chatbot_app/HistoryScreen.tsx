import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from './AuthContext'; // Import useAuth hook
import CONFIG from './config';

// ChatItem 정의
interface ChatItem {
  history_id: number;
  chat: { user: string; ai: string }[];
}

// 루트스택 파라미터 정의
type RootStackParamList = {
  Home: undefined;
  History: { refresh?: number };
  Profile: undefined;
  ChatDetail: { historyId: number };
};

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;
type HistoryScreenRouteProp = RouteProp<RootStackParamList, 'History'>;

// 채팅기록 화면 컴포넌트 정의
export default function HistoryScreen() {
  // 서버에서 가져온 채팅 기록 데이터 초기화 및 업데이트
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  // 데이터 로딩 상태 표시
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  // 새로고침 파라메터 받는 부분.
  const route = useRoute<HistoryScreenRouteProp>();
  const { userToken } = useAuth(); // Use the useAuth hook to get the userToken

  // chathistory 컴포넌트를 1회만 실행하도록 하는 효과
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // refresh prop이 true일 때만 fetchChatHistory()를 호출하도록
  useEffect(() => {
    if (route.params?.refresh) {
      fetchChatHistory();
    }
  }, [route.params?.refresh]);

  // 서버에 history 요청 및 
  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${CONFIG.API_URL}/history`, {
        headers: { Authorization: `Bearer ${userToken}` }, // Add JWT token to the request
        withCredentials: true
      });
      setChatHistory(response.data.chat_history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      Alert.alert('Error', 'Failed to fetch chat history');
    } finally {
      setIsLoading(false);
    }
  };

  // 채팅 기록 삭제. historyId = 채팅목록 렌더링시 각 항목에서 받음
  const deleteChat = async (historyId: number) => {
    try {
      const response = await axios.delete(`${CONFIG.API_URL}/delete_chat/${historyId}`, {
        headers: { Authorization: `Bearer ${userToken}` }, // Add JWT token to the request
        withCredentials: true
      });
      if (response.data.success) {
        setChatHistory(chatHistory.filter(item => item.history_id !== historyId));
      } else {
        Alert.alert('Error', 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      Alert.alert('Error', 'Failed to delete chat');
    }
  };

  // 사이드 채팅 목록 렌더링
  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity 
      style={styles.listItem}
      // 각 채팅 상세로 이동
      onPress={() => navigation.navigate('ChatDetail', { historyId: item.history_id })}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemText} numberOfLines={1}>
          {item.chat[0].user.length > 15 // 글자수 15자 이상이면 ...붙이고 나머지 자르기
            ? `${item.chat[0].user.substring(0, 15)}...`
            : item.chat[0].user}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete Chat',
              'Are you sure you want to delete this chat?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteChat(item.history_id) }
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#6c757d" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  // 로딩중일때
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.history_id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={fetchChatHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  listItem: {
    backgroundColor: '#343a40',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
});