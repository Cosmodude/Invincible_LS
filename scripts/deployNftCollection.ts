import { Address, toNano } from 'ton-core';
import { NftCollection } from '../wrappers/NftCollection';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { buildNftCollectionContentCell } from '../wrappers/collectionContent/offChain';

let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");


export async function run(provider: NetworkProvider) {
    const nftCollection = provider.open(NftCollection.createFromConfig({
        ownerAddress: myAddress, 
        nextItemIndex: 0,
        collectionContent: buildNftCollectionContentCell({
            collectionContent: "https://raw.githubusercontent.com/Cosmodude/Invincible_LS/main/sampleMetadata.json",
            commonContent:""
        }),
        nftItemCode: await compile("NftItem"),
        royaltyParams: {
            royaltyFactor: 9,
            royaltyBase: 900,
            royaltyAddress: provider.sender().address as Address
        }
    }, await compile('NftCollection')));

    console.log(provider.sender().address as Address)
    await nftCollection.sendDeploy(provider.sender(), toNano('0.05'));
    console.log()
    await provider.waitForDeploy(nftCollection.address);
}
