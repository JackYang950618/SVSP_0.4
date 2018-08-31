package com.jdlink.service;

import com.jdlink.domain.Account.Authority;
import com.jdlink.domain.Account.Function;
import com.jdlink.domain.Account.Role;
import com.jdlink.domain.LoginLog;
import com.jdlink.domain.User;

import java.util.List;
import java.util.Map;

/**
 * Created by matt on 2018/4/23.
 */
public interface UserService {

    List<User> list();

    List<User> get(Map params);

    void add(User user);
    List<User> getByUsername(String username);

    User getById(String id);

    void addLog(LoginLog loginLog);

    List<LoginLog> getLogById(int id);

    /**
     * 列出所有角色
     * @return
     */
    List<Role> listRole();

    /**
     * 设置用户的角色编号
     * @param roleId 角色编号
     */
    void setRole(int userId, int roleId);

    /**
     * 增加角色
     * @param role 角色
     */
    void addRole(Role role);

    /**
     * 更新角色名称
     * @param role 角色
     */
    void setRoleName(Role role);

    /**
     * 列出所有功能
     * @return
     */
    List<Function> listFunction();

    /**
     * 从权限表中根据角色编号获取该角色可操作的功能列表
     * @param roleId 角色编号
     * @return 功能列表
     */
    List<Function> getFunctionByRoleId(int roleId);

    /**
     * 列出所有权限
     * @return
     */
    List<Authority> listAuthority();

    /**
     * 更新权限
     * @param roleId 角色编号
     * @param functionIdList 功能编号列表
     */
    void updateAuthority(int roleId, int[] functionIdList);

    /**
     * 校验当前账号所对应的角色是否可以进入该功能
     * @param roleId 角色编号
     * @param functionId 功能编号
     * @return 能否进入
     */
    boolean checkAuthority(int roleId, int functionId);

}
