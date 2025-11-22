import { getAbTestBySlug } from '@/app/actions/ab-test';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function AbTestRunnerPage({ params }: PageProps) {
    const { slug } = await params;
    const test = await getAbTestBySlug(slug);

    if (!test || test.status !== 'active' || !test.variants || test.variants.length === 0) {
        notFound();
    }

    // Random selection logic
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedVariant = test.variants[0];

    for (const variant of test.variants) {
        cumulative += variant.trafficPercentage;
        if (random <= cumulative) {
            selectedVariant = variant;
            break;
        }
    }

    // Fallback to first if something goes wrong (e.g. percentages < 100)
    if (!selectedVariant) {
        selectedVariant = test.variants[0];
    }

    if (!selectedVariant.quiz) {
        // Should not happen if relations are correct and quiz exists
        notFound();
    }

    // Redirect with tracking params
    const targetUrl = `/quiz/${selectedVariant.quiz.slug}?utm_source=ab_test&utm_campaign=${test.slug}&utm_content=${selectedVariant.id}`;
    redirect(targetUrl);
}
