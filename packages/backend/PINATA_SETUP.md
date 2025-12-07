# Pinata IPFS Integration Setup

## Overview
This project uses Pinata for decentralized IPFS storage for:
- Contract documents (agreements, invoices, technical specs)
- NFT metadata and images
- Chat profile avatars
- Any other file storage needs

## Configuration

### Environment Variables

**Frontend (.env.local):**
```
VITE_PINATA_API_KEY=511cfe2dae26320f645
VITE_PINATA_JWT=your-jwt-token-here
```

**Backend (.env):**
```
PINATA_API_KEY=511cfe2dae26320f645
PINATA_API_SECRET=your-secret-here
PINATA_JWT=your-jwt-token-here
```

## Frontend Usage

### Import the Service
```typescript
import { uploadToPinata, uploadJSONToPinata, getIPFSUrl } from '@/lib/pinata';
```

### Upload a File
```typescript
const handleFileUpload = async (file: File) => {
  try {
    const result = await uploadToPinata(file, {
      name: 'contract-document.pdf',
      keyvalues: {
        type: 'contract',
        contractId: 'contract_123',
      }
    });
    
    console.log('IPFS Hash:', result.IpfsHash);
    console.log('URL:', getIPFSUrl(result.IpfsHash));
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Upload JSON (for NFT Metadata)
```typescript
const metadata = {
  name: 'My NFT',
  description: 'NFT description',
  image: 'ipfs://QmHash...',
  attributes: [
    { trait_type: 'Rarity', value: 'Rare' }
  ]
};

const result = await uploadJSONToPinata(metadata, {
  name: 'nft-metadata.json'
});
```

### Get IPFS URL
```typescript
const ipfsUrl = getIPFSUrl('QmYourHash', 'pinata'); // or 'ipfs' or 'cloudflare'
```

## Backend Implementation

### Install Dependencies
```bash
npm install axios form-data
```

### Example Node.js Service
```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadFileToPinata(filePath, metadata) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath));
  
  if (metadata) {
    data.append('pinataMetadata', JSON.stringify(metadata));
  }
  
  const response = await axios.post(url, data, {
    maxBodyLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      Authorization: `Bearer ${process.env.PINATA_JWT}`
    }
  });
  
  return response.data;
}
```

## API Endpoints to Implement

### POST /api/upload/contract-document
Upload contract documents to IPFS
```typescript
router.post('/upload/contract-document', upload.single('file'), async (req, res) => {
  const result = await uploadFileToPinata(req.file.path, {
    name: req.file.originalname,
    keyvalues: {
      contractId: req.body.contractId,
      type: 'contract-document'
    }
  });
  
  res.json({ ipfsHash: result.IpfsHash });
});
```

### POST /api/upload/avatar
Upload chat profile avatars
```typescript
router.post('/upload/avatar', upload.single('avatar'), async (req, res) => {
  const result = await uploadFileToPinata(req.file.path, {
    name: `avatar-${req.body.walletAddress}`,
    keyvalues: {
      type: 'avatar',
      walletAddress: req.body.walletAddress
    }
  });
  
  res.json({ ipfsHash: result.IpfsHash });
});
```

### POST /api/nft/metadata
Generate and upload NFT metadata
```typescript
router.post('/api/nft/metadata', async (req, res) => {
  const metadata = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.imageHash, // IPFS hash of the image
    attributes: req.body.attributes
  };
  
  const result = await uploadJSONToPinata(metadata);
  res.json({ metadataHash: result.IpfsHash });
});
```

## Features Available

1. **File Upload** - Upload any file type to IPFS
2. **JSON Upload** - Upload JSON data (perfect for NFT metadata)
3. **Multiple Gateways** - Access via Pinata, IPFS.io, or Cloudflare
4. **Metadata** - Add custom metadata and key-value pairs
5. **Unpin** - Remove files from IPFS when no longer needed
6. **List Files** - Get all pinned files
7. **Test Connection** - Verify API credentials

## Use Cases

### Contract Management
- Upload signed agreements
- Store technical specifications
- Archive invoices and receipts

### NFT Projects (ERC-721, ERC-1155)
- Upload NFT images
- Generate and store metadata JSON
- Bulk upload for collections

### Community Chat
- Store user avatars
- Profile images

### General Assets
- Product images
- Documentation files
- Media assets

## Important Notes

1. **API Rate Limits**: Check Pinata dashboard for your plan limits
2. **File Size**: Max file size depends on your Pinata plan
3. **Cost**: Free tier: 1GB storage, paid plans for more
4. **Persistence**: Files are pinned permanently until unpinned
5. **Security**: Never expose API keys in frontend code (use backend proxy)

## Testing

Test the connection:
```typescript
import { testPinataConnection } from '@/lib/pinata';

const isConnected = await testPinataConnection();
console.log('Pinata connected:', isConnected);
```

## Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata Dashboard](https://app.pinata.cloud/)
