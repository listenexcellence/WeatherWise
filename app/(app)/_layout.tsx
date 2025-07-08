import React from 'react';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AppLayout() {

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
      </Stack>
    </>
  );
}
