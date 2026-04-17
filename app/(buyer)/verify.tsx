import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../lib/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useBuyerStore } from '../../stores/buyerStore';

/* ── Task Card ─────────────────────────────────────────────── */
function TaskCard({ task, onStart }: { task: any; onStart: () => void }) {
  return (
    <Card style={styles.taskCard}>
      <View style={styles.taskTop}>
        <View style={styles.taskLeft}>
          <View style={styles.distBadge}>
            <Feather name="navigation" size={12} color={Colors.primary} />
            <Text style={styles.distText}>{task.distance_km} km away</Text>
          </View>
          <Text style={styles.taskRegion}>
            {task.farmer?.region || 'Ludhiana'}, {task.farmer?.state || 'Punjab'}
          </Text>
        </View>
        <Badge
          label={task.status === 'pending' ? 'Needs Visit' : task.status}
          color={Colors.secondary}
          bg={Colors.secondaryBg}
        />
      </View>

      <View style={styles.taskDetails}>
        <View style={styles.taskDetail}>
          <Feather name="cpu" size={14} color={Colors.textSecondary} />
          <Text style={styles.taskDetailText}>
            AI Score: {task.submission?.quality_score || '4'}/5
          </Text>
        </View>
        <View style={styles.taskDetail}>
          <Feather name="clock" size={14} color={Colors.textSecondary} />
          <Text style={styles.taskDetailText}>~45 min round trip</Text>
        </View>
      </View>

      <Button title="Start Verification" onPress={onStart} size="md" />
    </Card>
  );
}

/* ── Active Verification View ──────────────────────────────── */
function ActiveVerification({ task, onComplete }: { task: any; onComplete: () => void }) {
  const [arrived, setArrived] = useState(false);
  const [photosTaken, setPhotosTaken] = useState({ burial: false, depth: false });
  const allPhotos = photosTaken.burial && photosTaken.depth;

  return (
    <>
      <View style={styles.activeHeader}>
        <Text style={styles.title}>Verify Submission</Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{arrived ? 'On Site' : 'En Route'}</Text>
        </View>
      </View>

      <Card variant="elevated" style={styles.farmCard}>
        <View style={styles.farmRow}>
          <Feather name="map-pin" size={18} color={Colors.primary} />
          <View style={styles.farmInfo}>
            <Text style={styles.farmName}>{task.farmer?.profile?.name || 'Farm Location'}</Text>
            <Text style={styles.farmCoords}>
              {task.distance_km}km away · {task.farmer?.region || 'Ludhiana'}
            </Text>
          </View>
        </View>
      </Card>

      {!arrived ? (
        <Button
          title="I've Arrived"
          onPress={() => setArrived(true)}
          icon={<Feather name="check-circle" size={18} color={Colors.textOnPrimary} />}
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Photo Checklist</Text>
          <Card style={styles.checklistCard}>
            <ChecklistItem
              label="Buried biochar photo"
              done={photosTaken.burial}
              onPress={() => setPhotosTaken((p) => ({ ...p, burial: true }))}
            />
            <View style={styles.dividerLine} />
            <ChecklistItem
              label="Depth measurement photo"
              done={photosTaken.depth}
              onPress={() => setPhotosTaken((p) => ({ ...p, depth: true }))}
            />
          </Card>

          <Button
            title="Approve Submission"
            onPress={onComplete}
            disabled={!allPhotos}
            icon={<Feather name="check" size={18} color={allPhotos ? Colors.textOnPrimary : Colors.textTertiary} />}
          />
          {!allPhotos && (
            <Text style={styles.hint}>Complete all photos to approve</Text>
          )}
        </>
      )}
    </>
  );
}

function ChecklistItem({ label, done, onPress }: { label: string; done: boolean; onPress: () => void }) {
  return (
    <View style={styles.checkRow}>
      <View style={[styles.checkCircle, done && styles.checkCircleDone]}>
        {done ? (
          <Feather name="check" size={14} color={Colors.textOnPrimary} />
        ) : (
          <Feather name="camera" size={14} color={Colors.textTertiary} />
        )}
      </View>
      <Text style={[styles.checkLabel, done && styles.checkLabelDone]}>{label}</Text>
      {!done && <Button title="Capture" size="sm" onPress={onPress} style={{ width: 90 }} />}
    </View>
  );
}

/* ── Completed Row ─────────────────────────────────────────── */
function CompletedRow({ task }: { task: any }) {
  const date = new Date(task.completed_at || '').toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });
  return (
    <Card style={styles.completedCard}>
      <View style={styles.completedRow}>
        <View style={styles.completedLeft}>
          <View style={styles.doneCircle}>
            <Feather name="check" size={14} color={Colors.textOnPrimary} />
          </View>
          <View>
            <Text style={styles.completedDate}>{date}</Text>
            <Text style={styles.completedRegion}>{task.distance_km}km · Ludhiana</Text>
          </View>
        </View>
        <Badge label="Done" color={Colors.primary} bg={Colors.primaryBg} />
      </View>
    </Card>
  );
}

/* ── Main Screen ───────────────────────────────────────────── */
export default function VerifyScreen() {
  const { pendingTasks, activeTask, completedTasks, totalVerified, loadMockData, acceptTask, completeTask } = useBuyerStore();

  useEffect(() => { loadMockData(); }, []);

  const handleStart = (taskId: string) => {
    acceptTask(taskId);
  };

  const handleComplete = () => {
    if (!activeTask) return;
    Alert.alert(
      'Verification Complete! ✅',
      'The submission has been verified and approved.',
      [{ text: 'Done', onPress: () => completeTask(activeTask.id) }]
    );
  };

  // If there's an active task, show the verification flow
  if (activeTask) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ActiveVerification task={activeTask} onComplete={handleComplete} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify</Text>
        <Text style={styles.subtitle}>
          {pendingTasks.length} submissions to verify
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.miniStat}>
          <Text style={styles.miniStatValue}>{totalVerified}</Text>
          <Text style={styles.miniStatLabel}>VERIFIED</Text>
        </Card>
        <Card style={styles.miniStat}>
          <Text style={styles.miniStatValue}>{pendingTasks.length}</Text>
          <Text style={styles.miniStatLabel}>PENDING</Text>
        </Card>
      </View>

      {/* Pending */}
      {pendingTasks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pending</Text>
          {pendingTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStart={() => handleStart(task.id)} />
          ))}
        </>
      )}

      {/* Completed */}
      {completedTasks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Completed</Text>
          {completedTasks.map((task) => (
            <CompletedRow key={task.id} task={task} />
          ))}
        </>
      )}

      {pendingTasks.length === 0 && completedTasks.length === 0 && (
        <Card style={styles.emptyCard}>
          <Feather name="inbox" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>No submissions to verify</Text>
          <Text style={styles.emptySub}>Farmer submissions will appear here when ready</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: Spacing.xl, gap: Spacing.lg },

  header: {},
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.text },
  subtitle: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Stats
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  miniStat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.md },
  miniStatValue: { fontFamily: Fonts.display, fontSize: 22, color: Colors.text },
  miniStatLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textSecondary, letterSpacing: 1 },

  // Section
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },

  // Task Card
  taskCard: { padding: Spacing.lg, gap: Spacing.lg },
  taskTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  taskLeft: { gap: 4 },
  distBadge: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  distText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.primary },
  taskRegion: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },
  taskDetails: { flexDirection: 'row', gap: Spacing.xl },
  taskDetail: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  taskDetailText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },

  // Active verification
  activeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primaryBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  statusText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.primary },
  farmCard: { padding: Spacing.lg, gap: Spacing.md },
  farmRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  farmInfo: { flex: 1, gap: 2 },
  farmName: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  farmCoords: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary },

  // Checklist
  checklistCard: { padding: Spacing.lg },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  checkCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  checkCircleDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkLabel: { flex: 1, fontFamily: Fonts.body, fontSize: 14, color: Colors.text },
  checkLabelDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  dividerLine: { height: 1, backgroundColor: Colors.border },
  hint: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textTertiary, textAlign: 'center' },

  // Completed
  completedCard: { padding: Spacing.lg },
  completedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  completedLeft: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  doneCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  completedDate: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.text },
  completedRegion: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textSecondary },

  // Empty
  emptyCard: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xxxl },
  emptyText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.text },
  emptySub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textTertiary, textAlign: 'center' },
});
