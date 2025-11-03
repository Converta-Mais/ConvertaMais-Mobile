// src/navigation/AppStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/app/HomeScreen';
import CampaignsScreen from '../screens/app/CampaignsScreen';
import CampaignDetailsScreen from '../screens/app/CampaignDetailsScreen';

export type AppStackParamList = {
  Home: undefined;
  Campaigns: undefined;
  CampaignDetails: { campaignId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Campaigns" component={CampaignsScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
    </Stack.Navigator>
  );
}
