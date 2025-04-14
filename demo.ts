import * as PostalMime from 'postal-mime'
import * as mimeDb from 'mime-db'

import * as unzipit from 'unzipit'
import * as pako from 'pako'

import { XMLParser } from 'fast-xml-parser'

import {
  Env,
  Attachment,
  DmarcRecordRow,
  AlignmentType,
  DispositionType,
  DMARCResultType,
  PolicyOverrideType,
} from './types'

export default {
  async email(message: EmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleEmail(message, env, ctx)
  },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleEmail(message: EmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
}

async function getDMARCReportXML(attachment: Attachment) {
}

async function getXMLFromZip(content: string | ArrayBuffer | Blob | unzipit.TypedArray | unzipit.Reader) {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getReportRows(report: any): DmarcRecordRow[] {
}

async function sendToAnalyticsEngine(env: Env, reportRows: DmarcRecordRow[]) {
  if (!env.DMARC_ANALYTICS) {
    return
  }

  reportRows.forEach((recordRow, index) => {
    const blobs: string[] = []
    const doubles: number[] = []
    const indexes: string[] = []

    indexes.push(encodeURI(`${recordRow.reportMetadataReportId}-${index}`).slice(0, 32)) // max size 32 bytes

    blobs.push(recordRow.reportMetadataReportId)
    blobs.push(recordRow.reportMetadataOrgName)
    doubles.push(recordRow.reportMetadataDateRangeBegin)
    doubles.push(recordRow.reportMetadataDateRangeEnd)
    blobs.push(recordRow.reportMetadataError)

    blobs.push(recordRow.policyPublishedDomain)
    doubles.push(recordRow.policyPublishedADKIM)
    doubles.push(recordRow.policyPublishedASPF)
    doubles.push(recordRow.policyPublishedP)
    doubles.push(recordRow.policyPublishedSP)
    doubles.push(recordRow.policyPublishedPct)

    blobs.push(recordRow.recordRowSourceIP)
    doubles.push(recordRow.recordRowCount)
    doubles.push(recordRow.recordRowPolicyEvaluatedDKIM)
    doubles.push(recordRow.recordRowPolicyEvaluatedSPF)
    doubles.push(recordRow.recordRowPolicyEvaluatedDisposition)
    doubles.push(recordRow.recordRowPolicyEvaluatedReasonType)
    blobs.push(recordRow.recordIdentifiersEnvelopeTo)
    blobs.push(recordRow.recordIdentifiersHeaderFrom)

    env.DMARC_ANALYTICS.writeDataPoint({
      blobs: blobs,
      doubles: doubles,
      indexes: indexes,
    })
  })
}