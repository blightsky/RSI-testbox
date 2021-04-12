import {Wallet} from "@/ig-template/features/wallet/Wallet.ts";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {WalletSaveData} from "@/ig-template/features/wallet/WalletSaveData";
import Decimal from "@/lib/break_eternity.min";


describe('Wallet', () => {

    let moneyWallet: Wallet;

    beforeEach(() => {
        moneyWallet = new Wallet([CurrencyType.Voidlings]);
    });

    test('moneyWallet instantiates properly', () => {
        // Act

        // Assert
        expect(moneyWallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(0))
    });


    test('gaining money', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(1, CurrencyType.Voidlings));
        const money = moneyWallet.getAmount(CurrencyType.Voidlings);

        // Assert
        expect(money).toEqual(new Decimal(1));
    });

    test('gaining negative amount not possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(-1, CurrencyType.Voidlings));
        const money = moneyWallet.getAmount(CurrencyType.Voidlings);

        // Assert
        expect(money).toEqual(new Decimal(0));
    });

    test('gaining NaN not possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(NaN, CurrencyType.Voidlings));
        const money = moneyWallet.getAmount(CurrencyType.Voidlings);

        // Assert
        expect(money).toEqual(new Decimal(0));
    });

    test('multiplier', () => {
        // Act
        moneyWallet.setCurrencyMultiplier(2, CurrencyType.Voidlings);
        moneyWallet.gainCurrency(new Currency(1, CurrencyType.Voidlings));
        const money = moneyWallet.getAmount(CurrencyType.Voidlings);

        // Assert
        expect(money).toEqual(new Decimal(2));
    });

    test('negative multiplier not possible', () => {
        // Act
        moneyWallet.setCurrencyMultiplier(-1, CurrencyType.Voidlings);
        moneyWallet.gainCurrency(new Currency(1, CurrencyType.Voidlings));
        const money = moneyWallet.getAmount(CurrencyType.Voidlings);

        // Assert
        expect(money).toEqual(new Decimal(1));
    });

    test('has currency', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));

        // Assert
        expect(moneyWallet.hasCurrency(new Currency(10, CurrencyType.Voidlings))).toBeTruthy();
        expect(moneyWallet.hasCurrency(new Currency(11, CurrencyType.Voidlings))).toBeFalsy();
    });

    test('lose currency', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));
        moneyWallet.loseCurrency(new Currency(4, CurrencyType.Voidlings))

        // Assert
        expect(moneyWallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(6));
    });

    test('cannot lose invalid currency', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));
        moneyWallet.loseCurrency(new Currency(-1, CurrencyType.Voidlings))

        // Assert
        expect(moneyWallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(10));
    });

    test('pay if possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));
        const paid = moneyWallet.payIfPossible(new Currency(5, CurrencyType.Voidlings))

        // Assert
        expect(moneyWallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(5));
        expect(paid).toBeTruthy();
    });

    test('pay if not possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));
        const paid = moneyWallet.payIfPossible(new Currency(15, CurrencyType.Voidlings))

        // Assert
        expect(moneyWallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(10));
        expect(paid).toBeFalsy();
    });

    test('can access', () => {
        // Assert
        expect(moneyWallet.canAccess()).toBeTruthy();
    });

    test('save', () => {
        // Arrange
        const expectedSaveData: WalletSaveData = {
            voidlings: "10"
        };
        const wallet = new Wallet([CurrencyType.Voidlings]);

        // Act
        wallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));
        const actualSaveData = wallet.save();


        // Assert
        expect(actualSaveData).toEqual(expectedSaveData);
    });

    test('load', () => {
        // Arrange
        const saveData: WalletSaveData = {
            voidlings: "10"
        };
        const wallet = new Wallet([CurrencyType.Voidlings]);

        // Act
        wallet.load(saveData);

        // Assert
        expect(wallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(10));
    });

    test('load empty data', () => {
        // Arrange
        const wallet = new Wallet([CurrencyType.Voidlings]);

        // Act
        wallet.load({} as WalletSaveData);

        // Assert
        expect(wallet.getAmount(CurrencyType.Voidlings)).toEqual(new Decimal(0));
    });

    test('on currency gain', () => {
        // Arrange
        expect.assertions(2);

        moneyWallet.onCurrencyGain.subscribe(currency => {
            expect(currency.amount).toEqual(new Decimal(10));
            expect(currency.type).toBe(CurrencyType.Voidlings);
        });

        // Act
        moneyWallet.gainCurrency(new Currency(10, CurrencyType.Voidlings));
    });

});
