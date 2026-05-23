import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const MOCK_GYMS = [
  { id: '1', name: 'Gold\'s Gym', address: 'Baner, Pune', distance: '0.8 km', rating: 4.5, type: 'Premium', open: true, emoji: '🏋️' },
  { id: '2', name: 'Cult.fit',    address: 'Aundh, Pune', distance: '1.2 km', rating: 4.7, type: 'Boutique', open: true, emoji: '⚡' },
  { id: '3', name: 'Anytime Fitness', address: 'Viman Nagar, Pune', distance: '2.1 km', rating: 4.3, type: '24/7', open: true, emoji: '💪' },
  { id: '4', name: 'Snap Fitness', address: 'Wakad, Pune', distance: '3.4 km', rating: 4.1, type: '24/7', open: false, emoji: '🏅' },
  { id: '5', name: 'Talwalkars', address: 'Kothrud, Pune', distance: '4.2 km', rating: 4.0, type: 'Standard', open: true, emoji: '🏟️' },
];

const FILTERS = ['All', 'Nearby', 'Premium', '24/7', 'Yoga', 'Open Now'];

export const GymsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = MOCK_GYMS.filter(g => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Open Now') return g.open;
    if (activeFilter === 'Nearby') return parseFloat(g.distance) < 2;
    if (activeFilter === 'Premium') return g.type === 'Premium';
    if (activeFilter === '24/7') return g.type === '24/7';
    return true;
  });

  return (
    <ScreenWrapper scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: COLORS.white, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nearby Gyms</Text>
        <TouchableOpacity style={styles.mapBtn}>
          <Text style={{ fontSize: 18 }}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={{ fontSize: 48 }}>📍</Text>
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <Text style={styles.mapPlaceholderSub}>Google Maps integration ready</Text>
        <View style={styles.mapComingSoon}>
          <Text style={styles.mapComingSoonText}>📌 5 gyms nearby · Pune</Text>
        </View>
      </View>

      {/* Location Bar */}
      <View style={styles.locationBar}>
        <Text style={{ fontSize: 16 }}>📍</Text>
        <Text style={styles.locationText}>Baner, Pune, MH</Text>
        <TouchableOpacity style={styles.changeLocationBtn}>
          <Text style={styles.changeLocationText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Result count */}
      <Text style={styles.resultCount}>{filtered.length} gyms found</Text>

      {/* Gym List */}
      <View style={styles.gymList}>
        {filtered.map(gym => (
          <TouchableOpacity key={gym.id} style={styles.gymCard} activeOpacity={0.8}>
            <View style={styles.gymIconWrap}>
              <Text style={{ fontSize: 28 }}>{gym.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.gymNameRow}>
                <Text style={styles.gymName}>{gym.name}</Text>
                {!gym.open && (
                  <View style={styles.closedBadge}>
                    <Text style={styles.closedText}>Closed</Text>
                  </View>
                )}
              </View>
              <Text style={styles.gymAddress}>{gym.address}</Text>
              <View style={styles.gymMeta}>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>⭐ {gym.rating}</Text>
                </View>
                <View style={styles.typePill}>
                  <Text style={styles.typeText}>{gym.type}</Text>
                </View>
              </View>
            </View>
            <View style={styles.gymRight}>
              <Text style={styles.gymDistance}>{gym.distance}</Text>
              <TouchableOpacity style={[styles.directionsBtn, !gym.open && styles.directionsBtnDisabled]}>
                <Text style={styles.directionsText}>→</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coming soon note */}
      <View style={styles.comingSoonNote}>
        <Text style={styles.comingSoonIcon}>🚀</Text>
        <Text style={styles.comingSoonText}>
          Real-time availability, gym tours, and membership booking coming soon.
          Powered by Google Maps & Places API.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: 16,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  mapBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  mapPlaceholder: {
    marginHorizontal: SPACING.xl, height: 160,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', gap: 4,
    marginBottom: 14, position: 'relative',
  },
  mapPlaceholderText: { color: COLORS.white2, fontSize: 16, fontWeight: '700' },
  mapPlaceholderSub: { color: COLORS.white3, fontSize: 12 },
  mapComingSoon: {
    position: 'absolute', bottom: 12,
    backgroundColor: 'rgba(10,12,15,0.85)',
    borderRadius: RADIUS.circle, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.border,
  },
  mapComingSoonText: { color: COLORS.white2, fontSize: 12 },
  locationBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: SPACING.xl, marginBottom: 14,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 12,
  },
  locationText: { flex: 1, color: COLORS.white, fontSize: 13, fontWeight: '500' },
  changeLocationBtn: {
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.circle,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  changeLocationText: { color: COLORS.cyan, fontSize: 12, fontWeight: '600' },
  filtersRow: { paddingHorizontal: SPACING.xl, gap: 8, marginBottom: 10 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.circle,
    borderWidth: 1, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  filterText: { color: COLORS.white3, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: COLORS.bg },
  resultCount: { color: COLORS.white3, fontSize: 11, paddingHorizontal: SPACING.xl, marginBottom: 10 },
  gymList: { paddingHorizontal: SPACING.xl, gap: 10 },
  gymCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 14,
  },
  gymIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center',
  },
  gymNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gymName: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  closedBadge: {
    backgroundColor: 'rgba(255,92,92,0.12)',
    borderRadius: RADIUS.circle, paddingHorizontal: 6, paddingVertical: 1,
  },
  closedText: { color: COLORS.red, fontSize: 9, fontWeight: '700' },
  gymAddress: { color: COLORS.white3, fontSize: 11, marginTop: 2 },
  gymMeta: { flexDirection: 'row', gap: 6, marginTop: 6 },
  ratingPill: {
    backgroundColor: 'rgba(245,158,11,0.12)', borderRadius: RADIUS.circle,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  ratingText: { color: COLORS.amber, fontSize: 10, fontWeight: '600' },
  typePill: {
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.circle,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  typeText: { color: COLORS.white3, fontSize: 10, fontWeight: '600' },
  gymRight: { alignItems: 'center', gap: 8 },
  gymDistance: { color: COLORS.cyan, fontSize: 12, fontWeight: '700' },
  directionsBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.cyan, alignItems: 'center', justifyContent: 'center',
  },
  directionsBtnDisabled: { backgroundColor: COLORS.bg3 },
  directionsText: { color: COLORS.bg, fontSize: 14, fontWeight: '800' },
  comingSoonNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginHorizontal: SPACING.xl, marginTop: 20, marginBottom: 20,
    backgroundColor: COLORS.cyanAlpha06, borderWidth: 1, borderColor: COLORS.border2,
    borderRadius: RADIUS.lg, padding: 14,
  },
  comingSoonIcon: { fontSize: 20 },
  comingSoonText: { flex: 1, color: COLORS.white3, fontSize: 12, lineHeight: 18 },
});
