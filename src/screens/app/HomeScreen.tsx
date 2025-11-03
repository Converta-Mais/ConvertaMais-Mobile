// src/screens/app/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/constants';
import { AppStackParamList } from '../../navigation/AppStack';

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>
          Bem-vindo, {user?.displayName || 'Usuário'}! 👋
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Converta Mais</Text>
        <Text style={styles.subtitle}>
          Gerencie suas campanhas e leads de forma eficiente
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Navegando para Campaigns...'); // Debug
            navigation.navigate('Campaigns');
          }}
        >
          <Text style={styles.buttonText}>📊 Ver Campanhas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={signOut}
        >
          <Text style={styles.buttonTextSecondary}>🚪 Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  buttonTextSecondary: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
