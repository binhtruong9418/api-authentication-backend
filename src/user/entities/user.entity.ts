import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User { 
    @Prop({ required: true, unique: true, default: "email@gmail.com" })
    email: string;

    @Prop({ required: true, default: "123456" })
    password: string;

    @Prop({ unique: true, default: "" })
    mnemonic: string;

    @Prop({ default: true, required: true })
    verifiedMnemonic: boolean;

    @Prop({ default: false, required: true })
    verifiedEmail: boolean;

    @Prop({ default: ""})
    verifiedEmailCode: string;

    @Prop()
    accountId: number;
}

export const UserSchema = SchemaFactory.createForClass(User)
