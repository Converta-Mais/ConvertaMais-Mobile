import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erros, setErros] = useState({ email: '', senha: '' });
  const { signIn } = useAuth();

  // Carregar credenciais salvas ao montar o componente
  useEffect(() => {
    const carregarCredenciasSalvas = async () => {
      try {
        const emailSalvo = await AsyncStorage.getItem('loginEmail');
        const lembrar = await AsyncStorage.getItem('lembrarMe');
        
        if (emailSalvo && lembrar === 'true') {
          setEmail(emailSalvo);
          setLembrarMe(true);
        }
      } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
      }
    };

    carregarCredenciasSalvas();
  }, []);

  // Validar e-mail com regex
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validação em tempo real para e-mail
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validarEmail(text)) {
      setErros(prev => ({ ...prev, email: 'E-mail inválido' }));
    } else {
      setErros(prev => ({ ...prev, email: '' }));
    }
  };

  // Validação em tempo real para senha
  const handleSenhaChange = (text: string) => {
    setSenha(text);
    // Remover validação desnecessária, apenas limpar erro se houver texto
    if (text) {
      setErros(prev => ({ ...prev, senha: '' }));
    }
  };

  const handleLogin = async () => {
    // Validações
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Digite um e-mail válido');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email.trim().toLowerCase(), senha);
      
      // Salvar e-mail se "Lembrar-me" está marcado
      if (lembrarMe) {
        await AsyncStorage.setItem('loginEmail', email.trim().toLowerCase());
        await AsyncStorage.setItem('lembrarMe', 'true');
      } else {
        // Limpar dados salvos se desmarcou "Lembrar-me"
        await AsyncStorage.removeItem('loginEmail');
        await AsyncStorage.removeItem('lembrarMe');
      }
      
      // Limpar campos após login bem-sucedido
      setEmail('');
      setSenha('');
      setErros({ email: '', senha: '' });
    } catch (error: any) {
      // Tratamento de erros específicos
      const mensagem = error.message || '';
      
      if (mensagem.includes('user-not-found') || mensagem.includes('Usuário não encontrado')) {
        Alert.alert('Erro', 'E-mail não cadastrado. Deseja criar uma conta?', [
          { text: 'Não', onPress: () => {} },
          { text: 'Sim', onPress: () => navigation.navigate('Register') }
        ]);
      } else if (mensagem.includes('wrong-password') || mensagem.includes('Senha incorreta')) {
        Alert.alert('Erro', 'Senha incorreta. Tente novamente ou use "Esqueci a senha".', [
          { text: 'OK', onPress: () => {} },
          { text: 'Recuperar senha', onPress: () => navigation.navigate('ForgotPassword') }
        ]);
      } else if (mensagem.includes('too-many-requests') || mensagem.includes('Muitas tentativas')) {
        Alert.alert('Atenção', 'Muitas tentativas de login. Tente novamente mais tarde.');
      } else if (mensagem.includes('invalid-credential') || mensagem.includes('Credenciais inválidas')) {
        Alert.alert('Erro', 'E-mail ou senha incorretos. Tente novamente.');
      } else {
        Alert.alert('Erro', error.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com "Esqueci a Senha"
  const handleEsqueciSenha = () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail para recuperar a senha');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Digite um e-mail válido');
      return;
    }

    navigation.navigate('ForgotPassword', { email: email.trim().toLowerCase() });
  };

  const botaoDesabilitado = isLoading || !email.trim() || !senha.trim();

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
          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={[styles.input, erros.email && styles.inputError]}
            placeholder="seu@exemplo.com"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            accessibilityLabel="Campo de e-mail"
            textContentType="emailAddress"
            autoComplete="email"
          />
          {erros.email ? <Text style={styles.errorText}>{erros.email}</Text> : null}

          <Text style={styles.label}>Senha *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputWithIcon, erros.senha && styles.inputError]}
              placeholder="Digite sua senha"
              placeholderTextColor={COLORS.textSecondary}
              value={senha}
              onChangeText={handleSenhaChange}
              secureTextEntry={!mostrarSenha}
              editable={!isLoading}
              onSubmitEditing={handleLogin}
              accessibilityLabel="Campo de senha"
              textContentType="password"
              autoComplete="password"
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.eyeIcon}
              disabled={isLoading}
              accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Text style={styles.eyeText}>{mostrarSenha ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {erros.senha ? <Text style={styles.errorText}>{erros.senha}</Text> : null}

          {/* Opção Lembrar-me */}
          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setLembrarMe(!lembrarMe)}
              disabled={isLoading}
              accessibilityLabel="Checkbox lembrar-me"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: lembrarMe }}
            >
              <View style={[styles.checkboxBox, lembrarMe && styles.checkboxBoxChecked]}>
                {lembrarMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Lembrar-me</Text>
            </TouchableOpacity>

            {/* Link Esqueci a Senha */}
            <TouchableOpacity
              onPress={handleEsqueciSenha}
              disabled={isLoading}
              accessibilityLabel="Esqueci minha senha"
              accessibilityRole="button"
            >
              <Text style={styles.forgotPasswordLink}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, botaoDesabilitado && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={botaoDesabilitado}
            activeOpacity={0.8}
            accessibilityLabel="Botão entrar"
            accessibilityRole="button"
            accessibilityState={{ disabled: botaoDesabilitado }}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para Criar Conta */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Não tem conta? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')} 
              disabled={isLoading}
              accessibilityLabel="Criar conta"
              accessibilityRole="button"
            >
              <Text style={styles.signupLink}>Criar agora</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  inputWithIcon: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 0,
    marginBottom: 12,
    marginLeft: 4,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 14,
  },
  rememberText: {
    fontSize: 14,
    color: COLORS.text,
  },
  forgotPasswordLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
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
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
