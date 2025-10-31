// src/navigation/AppStack.tsx (atualizado)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CampaignsScreen from '../screens/app/CampaignsScreen';
import CampaignDetailsScreen from '../screens/app/CampaignDetailsScreen';

export type AppStackParamList = {
  Campaigns: undefined;
  CampaignDetails: { campaignId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Campaigns" component={CampaignsScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
    </Stack.Navigator>
  );
}
