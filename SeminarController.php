<?php

namespace App\Http\Controllers;

use App\Tbl_seminar_data;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SeminarController extends Controller{
	
    public function index(){
		return view('seminar.calendar');
	}
    public function seminar(){
		return view('seminar.seminar');
	}
    public function seminarDetails(){
		return view('seminar.seminar_details');
	}
    public function pastSeminarList(){
		return view('seminar.past_seminar_list');
	}
    public function pastIndex(){
		$start_year = 2015;
		$start_month = 5;

		$current_year  = date('Y');
		$current_month = date('m');

		// 開始年月から現在年月までの配列生成
		// ループ変数定義
		$i = $start_year;
		$j = $start_month;
		$ct =0;
		while ($i <= $current_year) {
			//配列への追記
			$date_arr[$ct]['year'] = $i;
			$date_arr[$ct]['month'] = sprintf("%02d", $j);
			//現在年月に到達していたらループ脱出
			if ($i == $current_year && $j == $current_month) {
				break;
			}
			//12月に到達していたら次の年にし月カウンタをリセットする
			if ($j == 12){
				$i++;
				$j = 0;
			}
			//月カウンタを次月にする
			$j++;
			$ct++;
		}

		// 生成した配列を降順にする
		$date_arr = array_reverse($date_arr);
		return view('seminar.past.index',compact('date_arr'));
	}

    public function detail($seq){
		//return view('seminar.detail');
		$data=Tbl_seminar_data::findOrFail($seq);
		$str_apply = $data->apply;
		$str_place_date = $data->place_date;
		$str_place=$data->seminar_area;
		$str_map=$data->map_info;

		if ($data->classification == 1) {
		$str_apply = "https://mypage.togo-sec.co.jp/forms/seminar_taimen/index.php?seminar_number=".$data->seminar_number;
		// WEB
		} elseif ($data->classification == 2) {
		$str_apply = "https://mypage.togo-sec.co.jp/forms/seminar_online/index.php?seminar_number=".$data->seminar_number;
		}
		// 会場(大規模)
		if ($data->classification == 3) {
		$str_apply = "https://mypage.togo-sec.co.jp/forms/seminar_taimen/index.php?seminar_number=".$data->seminar_number;
		}

		if((Carbon::now()->toDateString()>$data->display_enddate)&&($data->displayCheck!=1)){
			$str_apply = '';	
		}elseif($data->displayCheck == 2){
			$str_apply = '';
		}elseif($data->displayCheck == 3){
			$str_apply = '';
		}elseif($data->displayCheck == 4){
			$str_apply = '';
		}

		return view('seminar.detail',compact('data','str_apply','str_place_date','str_place','str_map'));
	}

	public function getInfo()
	{		
		$data=Tbl_seminar_data::all();
		$id=$data->pluck('seq');
		$date=Tbl_seminar_data::pluck('display_enddate');
		$semiName=Tbl_seminar_data::pluck('seminar_name');
		$status=$data->pluck('displayCheck');
		$place=Tbl_seminar_data::pluck('seminar_area');
		$classification=Tbl_seminar_data::pluck('classification');
		$lecName=Tbl_seminar_data::pluck('lecturer_name');
		$placeDate=Tbl_seminar_data::pluck('place_date');
		$img=Tbl_seminar_data::pluck('lecturer_image');
		return \Response::json(['success'=>true, 'idInfo'=>$id->all(),'dateInfo'=>$date,'semiInfo'=>$semiName,'statusInfo'=>$status,'placeInfo'=>$place,'classInfo'=>$classification,'nameInfo'=>$lecName,'placeDateInfo'=>$placeDate,'imgInfo'=>$img]);
		//$returnHTML = view('seminar.calendar')->with('dateInfo',$date,'semiInfo',$semiName,'statusInfo',$status)->render();
		//return response()->json(array('success'=>true,'dateInfo'=>$date,'semiInfo'=>$semiName,'statusInfo'=>$status));
		
	}
	
	function getPast(Request $request){
		$search_date = $request->input('search_date') ? $request->input('search_date') : date("Y-m"); 
		$str_now_date = date("Y-m-d");

		$data = Tbl_seminar_data::select('seminar_type','seminar_name')
				->where("display_enddate","like",$search_date."%")
				->where("displayCheck","<>","1")
				->where("display_enddate","<",$str_now_date)
				->orderBy("display_enddate","desc")
				->get();
		$ct = Tbl_seminar_data::where("display_enddate","like",$search_date."%")
				->where("displayCheck","<>","1")
				->where("display_enddate","<",$str_now_date)
				->count();
		return \Response::json(json_encode($data));
		//return view('common.test',compact('data'));
	}
}
