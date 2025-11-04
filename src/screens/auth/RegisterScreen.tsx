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

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha: string): { valida: boolean; mensagem?: string } => {
    if (senha.length < 8) {
      return { valida: false, mensagem: 'A senha deve ter no mínimo 8 caracteres' };
    }
    if (!/[A-Z]/.test(senha)) {
      return { valida: false, mensagem: 'Senha deve conter ao menos uma letra maiúscula' };
    }
    if (!/[0-9]/.test(senha)) {
      return { valida: false, mensagem: 'Senha deve conter ao menos um número' };
    }
    return { valida: true };
  };

  const formatarTelefone = (text: string): string => {
    const numeros = text.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleTelefoneChange = (text: string) => {
    setTelefone(formatarTelefone(text));
  };

  const handleRegister = async () => {
    // Validações
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Digite um e-mail válido');
      return;
    }

    const validacaoSenha = validarSenha(senha);
    if (!validacaoSenha.valida) {
      Alert.alert('Atenção', validacaoSenha.mensagem || 'Senha inválida');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email.trim().toLowerCase(), senha);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta. Tente novamente.');
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
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
            <Text style={styles.tabInactive}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.tabActive}>Registro</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor={COLORS.textSecondary}
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            editable={!isLoading}
            accessibilityLabel="Campo de nome completo"
            textContentType="name"
            autoComplete="name"
          />

          <Text style={styles.label}>E-mail *</Text>
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
            accessibilityLabel="Campo de e-mail"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <Text style={styles.label}>Telefone (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor={COLORS.textSecondary}
            value={telefone}
            onChangeText={handleTelefoneChange}
            keyboardType="phone-pad"
            editable={!isLoading}
            maxLength={15}
            textContentType="telephoneNumber"
            autoComplete="tel"
          />

          <Text style={styles.label}>Senha *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor={COLORS.textSecondary}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              editable={!isLoading}
              textContentType="newPassword"
              autoComplete="password-new"
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.eyeIcon}
              disabled={isLoading}
            >
              <Text style={styles.eyeText}>{mostrarSenha ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Senha *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Digite novamente"
              placeholderTextColor={COLORS.textSecondary}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmarSenha}
              editable={!isLoading}
              onSubmitEditing={handleRegister}
              textContentType="newPassword"
              autoComplete="password-new"
            />
            <TouchableOpacity
              onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              style={styles.eyeIcon}
              disabled={isLoading}
            >
              <Text style={styles.eyeText}>{mostrarConfirmarSenha ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !nome || !email || !senha || !confirmarSenha) && styles.buttonDisabled
            ]}
            onPress={handleRegister}
            disabled={isLoading || !nome || !email || !senha || !confirmarSenha}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
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
    marginBottom: 32,
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
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
    top: 10,
    padding: 4,
  },
  eyeText: {
    fontSize: 20,
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
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});
