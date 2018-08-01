/**
 * 测试MultiSender的token群发和ether群发功能
 */

var PoolinToken = artifacts.require('PoolinToken');
var MultiSender = artifacts.require('MultiSender');

let PINAddress = PoolinToken.address;
let SenderAddress = MultiSender.address;

let a1, a2, a3, a4;
let a1b, a2b, a3b, a4b;
let a1e, a2e, a3e, a4e;
let PINInstance;
let SenderInstance;

contract('PoolinToken', function (accounts) {
    [a1, a2, a3, a4, ...ae] = accounts;
    it("base info", async function () {
        PINInstance = await PoolinToken.deployed();
        SenderInstance = await MultiSender.deployed();

        console.log('----- Contract address -----');
        console.log('PIN', PINAddress);
        console.log('Sender', SenderAddress);

        console.log('----- PIN Balance -----');

        a1b = await PINInstance.balanceOf.call(a1);
        a2b = await PINInstance.balanceOf.call(a2);
        a3b = await PINInstance.balanceOf.call(a3);
        a4b = await PINInstance.balanceOf.call(a4);
        console.log(a1, a1b.toNumber());
        console.log(a2, a2b.toNumber());
        console.log(a3, a3b.toNumber());
        console.log(a4, a4b.toNumber());
    });

    it('token multi-send', async function () {
        // let transferRet = await PINInstance.transfer(a2, "4000000000000000000", {from: a1});
        // console.log('transferRet', transferRet);

        let approveRet = await PINInstance.approve(SenderAddress, "8000000000000000000", {from: a1});
        // console.log('approveRet', approveRet);

        // let allowanceRet = await PINInstance.allowance(a1, SenderAddress, {from: a1});
        // console.log('allowanceRet', allowanceRet.toNumber());

        let multiSendRet = await SenderInstance.multiSend(PINAddress, [a2, a3, a4], ["1000000000000000000", "1000000000000000000", "2000000000000000000"], {from: a1});
        // console.log('multiSendRet', multiSendRet);

        let a1b_end = await PINInstance.balanceOf.call(a1);
        let a2b_end = await PINInstance.balanceOf.call(a2);
        let a3b_end = await PINInstance.balanceOf.call(a3);
        let a4b_end = await PINInstance.balanceOf.call(a4);
        console.log('----- After Transfer PIN Balance -----');
        console.log(a1, a1b_end.toNumber());
        console.log(a2, a2b_end.toNumber());
        console.log(a3, a3b_end.toNumber());
        console.log(a4, a4b_end.toNumber());
        assert.equal(a1b_end.add(a2b_end).add(a3b_end).add(a4b_end).toString(), a1b.add(a2b).add(a3b).add(a4b).toString(), "批量转币失败");
    });

    it('ETH multi-send', async function () {
        a1e = await web3.eth.getBalance(a1);
        a2e = await web3.eth.getBalance(a2);
        a3e = await web3.eth.getBalance(a3);
        a4e = await web3.eth.getBalance(a4);
        console.log('----- ETH Balance -----');
        console.log(a1, a1e.toNumber());
        console.log(a2, a2e.toNumber());
        console.log(a3, a3e.toNumber());
        console.log(a4, a4e.toNumber());

        let multiSendRet = await SenderInstance.multiSend(
            0x000000000000000000000000000000000000bEEF,
            [a2, a3, a4],
            ["1000000000000000000", "1000000000000000000", "2000000000000000000"],
            {from: a1, value: "10000000000000000000"}
            );
        // console.log('multiSendRet', multiSendRet);

        let a1e_end = await web3.eth.getBalance(a1);
        let a2e_end = await web3.eth.getBalance(a2);
        let a3e_end = await web3.eth.getBalance(a3);
        let a4e_end = await web3.eth.getBalance(a4);
        console.log('----- After Transfer ETH Balance -----');
        console.log(a1, a1e_end.toNumber());
        console.log(a2, a2e_end.toNumber());
        console.log(a3, a3e_end.toNumber());
        console.log(a4, a4e_end.toNumber());
        assert.equal(a2e_end.toNumber(), a2e.add(1000000000000000000).toNumber(), "批量转ETH失败2");
        assert.equal(a3e_end.toNumber(), a3e.add(1000000000000000000).toNumber(), "批量转ETH失败3");
        assert.equal(a4e_end.toNumber(), a4e.add(2000000000000000000).toNumber(), "批量转ETH失败4");
    });
});

// assert.equal(balance, 10000, "10000 wasn't in the first account");