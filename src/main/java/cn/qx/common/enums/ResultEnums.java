package cn.qx.common.enums;

/**
 * 异常提示
 * @author Satone
 * @date 2019年2月26日
 */
public enum ResultEnums {

    SUCCESS("操作成功"),
    ERROR("操作失败"),
    INNER_ERROR("系统发生异常"),
    INPUT_ERROR("输入信息有误"),
    LOGIN_SUCCESS("登录成功"),
    LOGIN_UNKNOWN("账户不存在"),
    LOGIN_ERROR("用户名或密码错误"),
    LOGIN_CHECK_ERROR("输入的旧密码不匹配"),
    PARAMETER_ERROR("入参错误"),
    LOGIN_LOCKED("账号被锁定");

    private String info;

    public String getInfo() {
        return info;
    }

    ResultEnums(String info) {
        this.info = info;
    }
}
