// src/screens/auth/ForgotPasswordScreen.tsx
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
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/AuthStack';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
  route: ForgotPasswordScreenRouteProp;
}

export default function ForgotPasswordScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState(route.params?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [erros, setErros] = useState({ email: '' });
  const { resetPassword } = useAuth();

  // Validar e-mail com regex
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validação em tempo real
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validarEmail(text)) {
      setErros(prev => ({ ...prev, email: 'E-mail inválido' }));
    } else {
      setErros(prev => ({ ...prev, email: '' }));
    }
  };

  const handleResetPassword = async () => {
    // Validações
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail para recuperar a senha');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Digite um e-mail válido');
      return;
    }

    setIsLoading(true);

    try {
      // Chama a função de reset do contexto Firebase
      await resetPassword(email.trim().toLowerCase());
      
      setEmailSent(true);
      Alert.alert(
        'Sucesso',
        'Um e-mail de recuperação foi enviado para sua caixa de entrada. Verifique seu email (incluindo pasta de spam).',
        [
          {
            text: 'Voltar ao Login',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      const mensagem = error.message || '';
      
      if (mensagem.includes('user-not-found')) {
        Alert.alert('Atenção', 'E-mail não cadastrado no sistema. Deseja criar uma conta?', [
          { text: 'Não', onPress: () => {} },
          { text: 'Sim', onPress: () => navigation.navigate('Register') }
        ]);
      } else if (mensagem.includes('too-many-requests')) {
        Alert.alert('Atenção', 'Muitas tentativas. Tente novamente mais tarde.');
      } else {
        Alert.alert('Erro', error.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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

          <View style={styles.successContainer}>
            <Text style={styles.successEmoji}>✉️</Text>
            <Text style={styles.successTitle}>E-mail Enviado!</Text>
            
            <Text style={styles.successDescription}>
              Verifique sua caixa de entrada em{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>

            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Clique no link enviado por e-mail</Text>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Digite sua nova senha</Text>
              </View>

              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Faça login com a nova senha</Text>
              </View>
            </View>

            <Text style={styles.tipsTitle}>💡 Dica:</Text>
            <Text style={styles.tipsText}>
              Se não encontrar o e-mail, verifique sua pasta de{'\n'}
              <Text style={styles.tipsBold}>SPAM</Text> ou{'\n'}
              <Text style={styles.tipsBold}>PROMOÇÕES</Text>
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Voltar ao Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              <Text style={styles.secondaryButtonText}>Tentar outro e-mail</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite o e-mail associado à sua conta e enviaremos um link para resetar sua senha
          </Text>
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

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !email.trim()) && styles.buttonDisabled
            ]}
            onPress={handleResetPassword}
            disabled={isLoading || !email.trim()}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>← Voltar ao Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
          <Text style={styles.helpText}>
            Se você não conseguir recuperar sua senha, entre em contato com nosso suporte pelo email:{' '}
            <Text style={styles.helpLink}>suporte@exemplo.com</Text>
          </Text>
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
    marginBottom: 40,
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
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 32,
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
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 0,
    marginBottom: 12,
    marginLeft: 4,
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
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  helpContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  helpLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Success screen styles
  successContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emailHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  tipsBold: {
    fontWeight: '700',
    color: COLORS.text,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
