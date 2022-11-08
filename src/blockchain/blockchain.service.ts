import { ethers } from "ethers";
import { Injectable } from "@nestjs/common";
import { entropyToMnemonic } from "ethers/lib/utils";
import * as CryptoJS from "crypto-js";


@Injectable()
export class BlockchainService {
    async createMnemonic() {
        const entropy = ethers.utils.randomBytes(16);
        return await entropyToMnemonic(entropy);
    }

    async encryptMnemonic(mnemonic: string) {
        return CryptoJS.AES.encrypt(mnemonic, process.env.PASSPHRASE).toString();
    }

    async decryptMnemonic(encryptedMnemonic: string) {
        return CryptoJS.AES.decrypt(encryptedMnemonic, process.env.PASSPHRASE).toString(CryptoJS.enc.Utf8);
    }

    async checkMnemonic(mnemonic: string) {
        return ethers.utils.isValidMnemonic(mnemonic);
    }

    async createWallet(mnemonic: string, index: number) {
        const wallet = await ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`);
        return wallet;
    }
}