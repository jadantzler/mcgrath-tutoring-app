import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

// Not computed from the current date — "Last updated" should reflect when
// this text last actually changed, not whenever someone happens to load
// the page. Bump this string by hand the next time the policy is edited.
const LAST_UPDATED = 'August 21, 2026';

const OWNER_NAME = 'Paul McGrath';
const OWNER_EMAIL = 'McGrathTutoringLLC@gmail.com';
const OWNER_PHONE = '443-690-2768';

/**
 * Privacy Policy. Content follows the reviewed draft in the Technical
 * Design Document's companion doc (Notion: "Privacy Policy & Consent
 * Language — Draft"). That source document is explicitly marked "a
 * starting-point draft, not legal advice" — an attorney should review this
 * page, particularly the children's-data handling, before real families
 * start submitting the intake form against it.
 */
export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Privacy Policy
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Last updated: {LAST_UPDATED}
          </ThemedText>

          <Section heading="1. Information We Collect">
            <ThemedText type="default" style={styles.body}>
              Student information: name, school, grade, subject/test interests, current test scores
              (if provided), availability, whether the student has started looking at colleges (and
              which ones, if provided), and whether the student has been tutored before (and where,
              if provided).
            </ThemedText>
            <ThemedText type="default" style={styles.body}>
              Guardian information: name, email address, phone number, and preferred contact method.
            </ThemedText>
            <ThemedText type="default" style={styles.body}>
              Any additional information shared in the open-ended notes field.
            </ThemedText>
            <ThemedText type="default" style={styles.body}>
              This form is intended to be completed by a parent or legal guardian on the
              student&apos;s behalf.
            </ThemedText>
          </Section>

          <Section heading="2. How We Use Your Information">
            <ThemedText type="default" style={styles.body}>
              To respond to your tutoring inquiry and follow up about scheduling; to match your
              student with appropriate tutoring support; to maintain a record of prospective and
              current clients; and to contact you using your preferred contact method.
            </ThemedText>
            <ThemedText type="default" style={styles.body}>
              We do not sell your information or use it for advertising.
            </ThemedText>
          </Section>

          <Section heading="3. How We Store and Protect Your Information">
            <ThemedText type="default" style={styles.body}>
              Submissions are stored in a secure, access-controlled database. Data is transmitted
              using industry-standard encryption (HTTPS). Access is limited to McGrath Tutoring LLC.
            </ThemedText>
          </Section>

          <Section heading="4. How Long We Keep Your Information">
            <ThemedText type="default" style={styles.body}>
              Information is retained as long as reasonably necessary to respond to the inquiry, and
              for the duration of the tutoring relationship plus a reasonable record-keeping period.
              Deletion may be requested at any time.
            </ThemedText>
          </Section>

          <Section heading="5. Third-Party Services">
            <ThemedText type="default" style={styles.body}>
              Third-party providers (email delivery, hosting) may be used solely to operate the site
              and respond to inquiries — never for their own purposes.
            </ThemedText>
          </Section>

          <Section heading="6. Your Choices">
            <ThemedText type="default" style={styles.body}>
              You may request a copy of the information we have on file, request correction or
              deletion of that information, or withdraw consent for future contact, by reaching out
              using the contact information below.
            </ThemedText>
          </Section>

          <Section heading="7. Children's Privacy">
            <ThemedText type="default" style={styles.body}>
              This form is designed to be completed by a parent or guardian, not a child directly.
            </ThemedText>
          </Section>

          <Section heading="8. Changes to This Policy">
            <ThemedText type="default" style={styles.body}>
              The &quot;Last updated&quot; date above reflects the most recent revision to this
              policy.
            </ThemedText>
          </Section>

          <Section heading="9. Contact Us">
            <ThemedText type="default" style={styles.body}>
              {OWNER_NAME} — {OWNER_EMAIL} — {OWNER_PHONE}
            </ThemedText>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

/**
 * A section heading plus its body content — extracted only to avoid
 * repeating the same heading style/spacing nine times, not because this
 * content is data-driven the way `PILLARS`/`STORIES` are. Those get mapped
 * from an array because every card in the list shares one identical shape;
 * this page is one document where every section's content is genuinely
 * different (paragraphs here, a list there), so it's written directly as
 * JSX rather than forced into a generic array-of-sections renderer.
 */
function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" style={styles.sectionHeading}>
        {heading}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 32,
    lineHeight: 38,
  },
  section: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionHeading: {
    fontSize: 16,
  },
  body: {
    lineHeight: 24,
  },
});
