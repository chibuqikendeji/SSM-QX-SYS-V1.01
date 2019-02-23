package cn.qx.sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.qx.common.vo.JsonResult;
import cn.qx.sys.entity.Role;
import cn.qx.sys.service.SysRoleService;

@Controller
@RequestMapping("/role/")
public class RoleController {
	@Autowired
	private SysRoleService sysRoleService;
	@RequestMapping("doRoleListUI")
	public String doRoleListUI() {
		return "admin/page/common/role_list";
	}
	@ResponseBody
	@RequestMapping("doFindPageObjects")
	public JsonResult doFindPageObjects(String name, Integer pageCurrent) {
		return new JsonResult(sysRoleService.findPageObjects(name, pageCurrent));
	}
	
	@RequestMapping("doRoleEditUI")
	public String doMenuEditUI() {
		return "sys/role_edit";
	}
	
	// 添加角色
	@RequestMapping("doSaveObject")
	@ResponseBody
	public JsonResult doSaveObject(
			Role entity,Integer[] menuIds){
		sysRoleService.saveObject(entity,menuIds);
		return new JsonResult("save ok");    
	}

	@RequestMapping("doFindObjectById")
	@ResponseBody
	 public JsonResult doFindObjectById(Integer id){
	    	return new JsonResult(sysRoleService.findObjectById(id));
	 }

	@RequestMapping("doUpdateObject")
	@ResponseBody
	public JsonResult doUpdateObject(Role entity,
			Integer[] menuIds){
		sysRoleService.updateObject(entity,menuIds);
		return new JsonResult("update ok");
	}
	
	@RequestMapping("doFindObjects")
	@ResponseBody
	public JsonResult doFindObjects(){
		return new JsonResult(sysRoleService.findObjects());
	}

	
}
