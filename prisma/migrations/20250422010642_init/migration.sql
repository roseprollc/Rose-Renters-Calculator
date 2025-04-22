-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "aiSummary" TEXT;

-- AlterTable
ALTER TABLE "AnalysisVersion" ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "notes" TEXT;
