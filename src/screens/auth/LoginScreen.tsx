// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/AuthStack';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Atenção', 'Digite um e-mail válido');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email.trim().toLowerCase(), senha);
      // Navegação para Home ou outra tela protegida ocorre no contexto via estado user
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.tabContainer}>
          <Text style={styles.tabActive}>Login</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.tabInactive}>Registro</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@exemplo.com"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={COLORS.textSecondary}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!isLoading}
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBackground: {
    width: 90,
    height: 90,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 40,
  },
  tabActive: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    paddingBottom: 8,
  },
  tabInactive: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '400',
    paddingBottom: 8,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});
