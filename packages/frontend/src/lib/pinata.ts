import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

/**
 * Upload a file to Pinata IPFS
 * @param file - File to upload
 * @param metadata - Optional metadata for the file
 * @returns Pinata upload response with IPFS hash
 */
export async function uploadToPinata(
  file: File,
  metadata?: PinataMetadata
): Promise<PinataUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify(metadata));
    }

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload JSON data to Pinata IPFS
 * @param jsonData - JSON object to upload
 * @param metadata - Optional metadata
 * @returns Pinata upload response with IPFS hash
 */
export async function uploadJSONToPinata(
  jsonData: any,
  metadata?: PinataMetadata
): Promise<PinataUploadResponse> {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: jsonData,
        pinataMetadata: metadata,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw new Error('Failed to upload JSON to IPFS');
  }
}

/**
 * Get the IPFS gateway URL for a hash
 * @param ipfsHash - IPFS hash
 * @param gateway - Gateway to use (default: Pinata)
 * @returns Full URL to access the file
 */
export function getIPFSUrl(
  ipfsHash: string,
  gateway: 'pinata' | 'ipfs' | 'cloudflare' = 'pinata'
): string {
  const gateways = {
    pinata: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    ipfs: `https://ipfs.io/ipfs/${ipfsHash}`,
    cloudflare: `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
  };

  return gateways[gateway];
}

/**
 * Unpin a file from Pinata
 * @param ipfsHash - IPFS hash to unpin
 */
export async function unpinFromPinata(ipfsHash: string): Promise<void> {
  try {
    await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });
  } catch (error) {
    console.error('Error unpinning from Pinata:', error);
    throw new Error('Failed to unpin file from IPFS');
  }
}

/**
 * Get pinned files from Pinata
 * @param filters - Optional filters
 * @returns List of pinned files
 */
export async function getPinnedFiles(filters?: {
  status?: string;
  pageLimit?: number;
  pageOffset?: number;
}): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.pageLimit) params.append('pageLimit', filters.pageLimit.toString());
    if (filters?.pageOffset) params.append('pageOffset', filters.pageOffset.toString());

    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting pinned files:', error);
    throw new Error('Failed to get pinned files');
  }
}

/**
 * Test Pinata connection
 * @returns True if connection successful
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });
    return true;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
}
